import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './invoice.model';
import { Person } from '../person/person.model';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../user/auth/decorators/roles.decorator';
import { RolesGuard } from '../user/auth/guards/roles.guard';

@Controller('invoice')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  @Roles('admin')
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      return await this.invoiceService.create(createInvoiceDto);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestException(error.errors);
      }
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    try {
      return await this.invoiceService.update(id, updateInvoiceDto);
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
    await this.invoiceService.remove(id);
  }

  
  @Post(':invoiceId/persons')
  @Roles('admin')
  async addInvoiceToMultiplePersons(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body('personIds') personIds: number[],
  ): Promise<Invoice> {
    return this.invoiceService.addInvoiceToMultiplePersons(invoiceId, personIds);
  }

  @Delete(':invoiceId/persons')
  @Roles('admin')
  async removeInvoiceFromMultiplePersons(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body('personIds') personIds: number[],
  ): Promise<void> {
    await this.invoiceService.removeInvoiceFromMultiplePersons(invoiceId, personIds);
  }

}