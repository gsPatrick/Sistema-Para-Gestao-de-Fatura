import { IsString, IsInt, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsInt()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsBoolean()
  @IsNotEmpty()
  enable: boolean;

  @IsOptional()  // A propriedade deletedAt será opcional
  deletedAt?: Date | null;  // Permite marcar o endereço como deletado logicamente
}
