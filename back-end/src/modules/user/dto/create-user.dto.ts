import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Defina um tamanho mínimo para a senha
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user']) // Valores permitidos para a role
  role?: string; // 'admin' ou 'user', opcional
}