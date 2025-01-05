import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatusType } from '../modules/status-type/status-type.model';
import { Classification } from '../modules/classification/classification.model';
import { SeederService } from './seeder.service';
import { StatusTypeModule } from '../modules/status-type/status-type.module';
import { ClassificationModule } from '../modules/classification/classification.module';
import { InvoiceTypeModule } from '../modules/invoice-type/invoice-type.module';

@Module({
  imports: [
    SequelizeModule.forFeature([StatusType, Classification]),
    StatusTypeModule,
    ClassificationModule,
    InvoiceTypeModule
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}