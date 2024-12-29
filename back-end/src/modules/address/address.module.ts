import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [SequelizeModule, AddressService], // Exporte AddressService
})
export class AddressModule {}