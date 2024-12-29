import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { decode } from 'jsonwebtoken';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { UsersService } from '../user.service';
import { User } from '../user.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    console.log('registerUser - Senha em texto puro:', createUserDto.password); // Adicione este log
    console.log('registerUser - Hash gerado:', hashedPassword); // Adicione este log

    try {
      const { password, ...userData } = createUserDto; // Removendo a senha do objeto userData
      const user = await this.usersService.create({
        ...userData, // Usando os dados do usuário sem a senha
        password: hashedPassword, // Usando a senha criptografada
      });
      return user;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    this.logger.log(`Validating user with email: ${loginUserDto.email}`);

    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (user) {
      this.logger.debug(`User found: ${user.email}`);

      this.logger.debug(`Password provided (trimmed): ${loginUserDto.password.trim()}`);
      this.logger.debug(`Password from database (hash): ${user.password}`);

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password.trim(), // Removendo espaços em branco
        user.password,
      );

      this.logger.debug(`Password valid? ${isPasswordValid}`);

      if (isPasswordValid) {
        this.logger.debug(`Usuário validado: ${JSON.stringify(user)}`);
        return user;
      } else {
        this.logger.error(`Invalid password for user: ${user.email}`);
        throw new UnauthorizedException('Invalid password');
      }
    }

    this.logger.error(`User not found: ${loginUserDto.email}`);
    throw new UnauthorizedException('Invalid email');
  }

  async login(user: User): Promise<{ access_token: string; role: string }> { // Retorna a role também
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }; // Inclui a role no payload
    const access_token = this.jwtService.sign(payload);


    return { access_token, role: user.role }; // Retorna a role
  }
}