import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './person.model';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../user/auth/decorators/roles.decorator';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { Invoice } from '../invoice/invoice.model';

@Controller('person')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @Roles('admin')
  async create(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    try {
      return await this.personService.create(createPersonDto);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    try {
      return await this.personService.update(id, updatePersonDto);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.personService.remove(id);
  }

  @Delete(':personId/address/:addressId')
  @Roles('admin')
  async removeAddressFromPerson(
    @Param('personId', ParseIntPipe) personId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<void> {
    await this.personService.removeAddressFromPerson(personId, addressId);
  }

  @Get(':id/invoices')
  @Roles('admin')
  async getInvoicesByPersonId(@Param('id', ParseIntPipe) personId: number): Promise<Invoice[]> {
    return this.personService.findInvoicesByPersonId(personId);
  }
}