import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}