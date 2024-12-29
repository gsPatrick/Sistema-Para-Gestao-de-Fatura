import { Module, forwardRef } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person } from './person.model';
import { Invoice } from '../invoice/invoice.model';
import { AuthModule } from '../user/auth/auth.module';
import { Address } from '../address/address.model';
import { StatusType } from '../status-type/status-type.model';
import { PersonClassification } from '../person-classification/person-classification.model';
import { AddressModule } from '../address/address.module';
import { StatusTypeModule } from '../status-type/status-type.module';
import { ClassificationModule } from '../classification/classification.module';
import { PersonClassificationModule } from '../person-classification/person-classification.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Person, Invoice, Address, StatusType, PersonClassification]),
    AuthModule,
    AddressModule,
    StatusTypeModule,
    ClassificationModule,
    PersonClassificationModule,
    forwardRef(() => InvoiceModule), // Adicione forwardRef para evitar dependência circular
  ],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}