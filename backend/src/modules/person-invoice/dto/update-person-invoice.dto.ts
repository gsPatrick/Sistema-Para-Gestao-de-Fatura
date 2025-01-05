// Crie este arquivo em: src/invoice/dto/update-person-invoice.dto.ts

import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdatePersonInvoiceDto {
  @IsDate()
  @IsOptional()
  paid_at?: Date | null;

  @IsDate()
  @IsOptional()
  cancelled_at?: Date | null;

  @IsBoolean()
  @IsOptional()
  enable?: boolean;
}