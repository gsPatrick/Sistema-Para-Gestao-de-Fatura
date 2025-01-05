import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvoiceType } from './invoice-type.model';

@Module({
  imports: [SequelizeModule.forFeature([InvoiceType])],
  exports: [SequelizeModule]
})
export class InvoiceTypeModule {}