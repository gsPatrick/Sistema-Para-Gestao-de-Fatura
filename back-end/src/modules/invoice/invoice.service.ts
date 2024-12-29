import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from './invoice.model';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PersonService } from '../person/person.service';
import { Person } from '../person/person.model';
import { InvoiceType } from '../invoice-type/invoice-type.model';
import { PersonInvoice } from '../person-invoice/person-invoice.model';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    @InjectModel(PersonInvoice)
    private personInvoiceModel: typeof PersonInvoice,
    private personService: PersonService
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const { personId, ...invoiceData } = createInvoiceDto;
  
      const invoice = await this.invoiceModel.create(invoiceData);
  
      // Se um personId for fornecido, associe a fatura a essa pessoa
      if (personId) {
        const person = await this.personService.findOne(personId);
        if (!person) {
          throw new NotFoundException(`Person with ID ${personId} not found`);
        }
        await this.personInvoiceModel.create({ personId: person.id, invoiceId: invoice.id });
      }
  
      return invoice;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.findAll({
      include: [
        { model: Person, as: 'persons' },
        { model: InvoiceType, as: 'invoiceType' },
      ]
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id, {
      include: [
        { model: Person, as: 'persons' },
        { model: InvoiceType, as: 'invoiceType' },
      ]
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    try {
      await invoice.update(updateInvoiceDto);
      return invoice;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await invoice.destroy();
  }

  async addInvoiceToMultiplePersons(invoiceId: number, personIds: number[]): Promise<Invoice> {
    const invoice = await this.findOne(invoiceId);
    if (!invoice) {
    throw new NotFoundException(Invoice);
    }
    
    const transaction = await this.invoiceModel.sequelize.transaction();
    
    try {
      const existingAssociations = await this.personInvoiceModel.findAll({
        where: { invoiceId },
        attributes: ['personId'],
        transaction
      });
      const existingPersonIds = existingAssociations.map(a => a.personId);
    
      for (const personId of personIds) {
        if (!existingPersonIds.includes(personId)) {
          const person = await this.personService.findOne(personId);
          if (!person) {
            await transaction.rollback();
            throw new NotFoundException(`Person with ID ${personId} not found`);
          }
    
          await this.personInvoiceModel.create({ personId, invoiceId }, { transaction });
        }
      }
    
      await transaction.commit();
      return await this.findOne(invoiceId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeInvoiceFromMultiplePersons(invoiceId: number, personIds: number[]): Promise<void> {
    const transaction = await this.invoiceModel.sequelize.transaction();
    try {
        for (const personId of personIds) {
            const association = await this.personInvoiceModel.findOne({
                where: { invoiceId, personId },
                transaction
            });

            if (!association) {
                throw new NotFoundException(`Association not found for Invoice ID ${invoiceId} and Person ID ${personId}`);
            }

            await association.destroy({ transaction });
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
}