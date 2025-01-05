import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsOptional()  // Marque como opcional
  deletedAt?: Date | null; // Adicionando a propriedade deletedAt
}
