import { IsString, IsInt, IsBoolean, IsOptional, IsNotEmpty, ValidateNested, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { UpdateAddressDto } from '../../address/dto/update-address.dto';
import { CreatePersonClassificationDto } from '../../person-classification/dto/create-person-classification.dto';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsInt()
  @IsNotEmpty()
  statusTypeId: number;

  @IsString()
  @IsOptional()
  cellphone?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsBoolean()
  enable: boolean;

  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: 'admin' | 'user'; 

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'id',
      subTypes: [
        { value: CreateAddressDto, name: 'undefined' },
        { value: UpdateAddressDto, name: 'number' },
      ],
    },
  })
  addresses?: (CreateAddressDto | UpdateAddressDto)[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePersonClassificationDto)
  personClassifications?: CreatePersonClassificationDto[];
}