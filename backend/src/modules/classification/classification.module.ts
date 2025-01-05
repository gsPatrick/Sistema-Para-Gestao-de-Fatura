import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Classification } from './classification.model';

@Module({
  imports: [SequelizeModule.forFeature([Classification])],
  exports: [SequelizeModule]
})
export class ClassificationModule {}