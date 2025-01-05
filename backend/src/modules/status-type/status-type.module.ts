import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatusType } from './status-type.model';

@Module({
  imports: [SequelizeModule.forFeature([StatusType])],
  exports: [SequelizeModule]
})
export class StatusTypeModule {}