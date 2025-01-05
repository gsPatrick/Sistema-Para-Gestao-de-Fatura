import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
  ) {}

  async create(createAddressDto: CreateAddressDto, personId: number): Promise<Address> {
    return await this.addressModel.create({ ...createAddressDto, personId });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    await address.update(updateAddressDto);
    return address;
  }

  async delete(id: number): Promise<void> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    await address.destroy();
  }
}