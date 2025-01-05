import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateInvoiceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsNotEmpty()
  enable: boolean;
}