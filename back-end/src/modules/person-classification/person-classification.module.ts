import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonClassification } from './person-classification.model';

@Module({
  imports: [SequelizeModule.forFeature([PersonClassification])],
  exports: [SequelizeModule]
})
export class PersonClassificationModule {}