import { Module, forwardRef } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invoice } from './invoice.model';
import { PersonModule } from '../person/person.module';
import { AuthModule } from '../user/auth/auth.module';
import { InvoiceType } from '../invoice-type/invoice-type.model';
import { PersonInvoice } from '../person-invoice/person-invoice.model';
import { Person } from '../person/person.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Invoice, InvoiceType, Person, PersonInvoice]),
    forwardRef(() => PersonModule),
    AuthModule
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}