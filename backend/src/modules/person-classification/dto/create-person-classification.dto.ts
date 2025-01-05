import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePersonClassificationDto {
  @IsInt()
  @IsNotEmpty()
  classificationId: number;
}