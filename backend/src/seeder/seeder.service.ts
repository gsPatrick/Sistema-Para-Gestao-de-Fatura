import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StatusType } from '../modules/status-type/status-type.model';
import { Classification } from '../modules/classification/classification.model';
import { InvoiceType } from '../modules/invoice-type/invoice-type.model';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(StatusType)
    private statusTypeModel: typeof StatusType,
    @InjectModel(Classification)
    private classificationModel: typeof Classification,
    @InjectModel(InvoiceType)
    private invoiceTypeModel: typeof InvoiceType,
  ) {}

  async seed() {
    await this.seedStatusTypes();
    await this.seedClassifications();
    await this.seedInvoiceTypes();
    this.logger.log('Seeding completed.');
  }

  private async seedStatusTypes() {
    const statusTypes = [
      { name: 'Ativo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Inativo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pendente', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bloqueado', createdAt: new Date(), updatedAt: new Date() },
    ];

    for (const statusType of statusTypes) {
      try {
        const [instance, created] = await this.statusTypeModel.findOrCreate({
          where: { name: statusType.name },
          defaults: statusType,
        });

        if (created) {
          this.logger.log(`StatusType "${statusType.name}" created.`);
        } else {
          this.logger.log(`StatusType "${statusType.name}" already exists.`);
        }
      } catch (error) {
        this.logger.error(`Error creating StatusType "${statusType.name}": ${error.message}`);
      }
    }
  }

  private async seedClassifications() {
    const classifications = [
      { name: 'Cliente VIP', tag: 'VIP', enable: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cliente Regular', tag: 'REGULAR', enable: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cliente em Observação', tag: 'OBS', enable: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cliente Devedor', tag: 'DEVEDOR', enable: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    for (const classification of classifications) {
      try {
        const [instance, created] = await this.classificationModel.findOrCreate({
          where: { name: classification.name },
          defaults: classification,
        });

        if (created) {
          this.logger.log(`Classification "${classification.name}" created.`);
        } else {
          this.logger.log(`Classification "${classification.name}" already exists.`);
        }
      } catch (error) {
        this.logger.error(`Error creating Classification "${classification.name}": ${error.message}`);
      }
    }
  }

  private async seedInvoiceTypes() {
    const invoiceTypes = [
      { name: 'Mensalidade', code: 'MENSALIDADE', enable: true, createdAt: new Date(), updatedAt: new Date()  },
      { name: 'Serviço', code: 'SERVICO', enable: true, createdAt: new Date(), updatedAt: new Date()  },
      { name: 'Produto', code: 'PRODUTO', enable: false, createdAt: new Date(), updatedAt: new Date()  },
    ];

    for (const invoiceType of invoiceTypes) {
      try {
        const [instance, created] = await this.invoiceTypeModel.findOrCreate({
          where: { name: invoiceType.name },
          defaults: invoiceType,
        });

        if (created) {
          this.logger.log(`InvoiceType "${invoiceType.name}" created.`);
        } else {
          this.logger.log(`InvoiceType "${invoiceType.name}" already exists.`);
        }
      } catch (error) {
        this.logger.error(`Error creating InvoiceType "${invoiceType.name}": ${error.message}`);
      }
    }
  }
}