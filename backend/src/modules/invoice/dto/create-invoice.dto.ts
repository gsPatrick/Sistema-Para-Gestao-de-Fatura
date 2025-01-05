import { IsString, IsInt, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsOptional() // Torna personId opcional
  personId?: number;

  @IsInt()
  @IsNotEmpty()
  invoiceTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  fullvalue: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  amountPaid?: number;
}