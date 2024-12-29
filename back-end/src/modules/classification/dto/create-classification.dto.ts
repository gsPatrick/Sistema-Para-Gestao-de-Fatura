import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClassificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsBoolean()
  @IsNotEmpty()
  enable: boolean;
}