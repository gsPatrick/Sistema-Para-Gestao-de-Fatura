import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './address.model';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { Roles } from '../user/auth/decorators/roles.decorator';

@Controller('addresses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':personId')  // Inclui personId na URL
  @Roles('admin')
  async create(
    @Param('personId', ParseIntPipe) personId: number, // Extrai o personId da rota
    @Body() createAddressDto: CreateAddressDto
  ): Promise<Address> {
    return this.addressService.create(createAddressDto, personId); // Passa o personId para o serviço
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.addressService.delete(id);
  }
}