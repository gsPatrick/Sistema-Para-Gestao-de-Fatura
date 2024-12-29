import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Person } from './person.model';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { StatusType } from '../status-type/status-type.model';
import { Address } from '../address/address.model';
import { PersonClassification } from '../person-classification/person-classification.model';
import { Invoice } from '../invoice/invoice.model';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person)
    private personModel: typeof Person,
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(PersonClassification)
    private personClassificationModel: typeof PersonClassification
  ) { }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    try {
        const { addresses, personClassifications, ...personData } = createPersonDto;
  
        const person = await this.personModel.create(personData);
  
        if (addresses && addresses.length > 0) {
          const createdAddresses = await Promise.all(
            addresses.map(addressDto => this.addressModel.create({ ...addressDto, personId: person.id })),
          );
          await person.$add('addresses', createdAddresses);
        }
  
        if (personClassifications && personClassifications.length > 0) {
            const createdClassifications = await Promise.all(
              personClassifications.map(classificationDto => 
                this.personClassificationModel.create({ ...classificationDto, personId: person.id })
              ),
            );
            await person.$add('personClassifications', createdClassifications);
          }
  
        return await this.findOne(person.id);
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
  }

  async findAll(): Promise<Person[]> {
    return this.personModel.findAll({
      include: [
        { model: StatusType, as: 'statusType' },
        { model: Address, as: 'addresses' },
        { model: PersonClassification, as: 'personClassifications' },
        { model: Invoice, as: 'invoices' },
      ],
    });
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personModel.findByPk(id, {
      include: [
        { model: StatusType, as: 'statusType' },
        { model: Address, as: 'addresses' },
        { model: PersonClassification, as: 'personClassifications' },
        { model: Invoice, as: 'invoices' },
      ],
    });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    if (!person) {
        throw new NotFoundException(`Person with ID ${id} not found`);
    }

    try {
        await person.update(updatePersonDto);

        // Atualiza os endereços associados
        if (updatePersonDto.addresses) {
            await Promise.all(updatePersonDto.addresses.map(async addressDto => {
                if ('id' in addressDto && addressDto.id) {
                    const address = await this.addressModel.findByPk(addressDto.id);
                    if (address) {
                        // Atualiza os dados do endereço existente, incluindo o 'deletedAt' se necessário
                        await address.update({ ...addressDto, deletedAt: addressDto.deletedAt || null });
                    } else {
                        console.warn(`Endereço com ID ${addressDto.id} não encontrado.`);
                    }
                } else {
                    // Se o endereço não tem um ID, cria um novo
                    await this.addressModel.create({ ...addressDto, personId: person.id });
                }
            }));
        }

        // Atualiza as classificações associadas
        if (updatePersonDto.personClassifications) {
            const existingClassifications = await this.personClassificationModel.findAll({ where: { personId: person.id } });
            const existingClassificationIds = existingClassifications.map(c => c.classificationId);
            const newClassificationIds = updatePersonDto.personClassifications.map(c => c.classificationId);

            // Remover classificações que não estão mais na lista
            const classificationsToRemove = existingClassifications.filter(c => !newClassificationIds.includes(c.classificationId));
            await Promise.all(classificationsToRemove.map(async c => {
                await this.personClassificationModel.destroy({ where: { personId: person.id, classificationId: c.classificationId } });
            }));

            // Adicionar novas classificações
            const classificationsToAdd = newClassificationIds.filter(id => !existingClassificationIds.includes(id));
            await Promise.all(classificationsToAdd.map(async classificationId => {
                await this.personClassificationModel.create({
                    personId: person.id,
                    classificationId: classificationId
                });
            }));
        }

        // Retorna a pessoa atualizada com os relacionamentos
        return await this.findOne(id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw new BadRequestException(error.errors);
        }
        throw error;
    }
}

async removeAddressFromPerson(personId: number, addressId: number): Promise<void> {
  const address = await this.addressModel.findOne({
      where: {
          id: addressId,
          personId: personId,
      },
  });

  if (!address) {
      throw new NotFoundException(
          `Address with ID ${addressId} not found or not associated with Person ID ${personId}`,
      );
  }

  await address.destroy();
}

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    await person.destroy();
  }

  async findInvoicesByPersonId(personId: number): Promise<Invoice[]> {
    const person = await this.personModel.findByPk(personId, {
      include: [
        {
          model: Invoice,
          as: 'invoices',
          include: [
            {
              model: Person,
              as: 'persons',
            },
          ],
        },
      ],
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    return person.invoices;
  }

}