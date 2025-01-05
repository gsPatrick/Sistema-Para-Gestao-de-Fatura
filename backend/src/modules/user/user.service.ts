import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Iniciando criação de usuário...');

    try {
      // NÃO criptografe a senha aqui, isso já foi feito no AuthService
      const user = await this.userModel.create({
        fullname: createUserDto.fullname,
        nickname: createUserDto.nickname,
        email: createUserDto.email,
        password: createUserDto.password, // Salve a senha que veio do AuthService (já criptografada)
        role: createUserDto.role || 'user',
      });

      this.logger.log(`Usuário criado com sucesso: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Adicione o método findOne como um alias para findById
  async findOne(id: number): Promise<User> {
    return this.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id); // Use o findById que você já tem
    if(updateUserDto.password){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updateUserDto.password, saltRounds);
        updateUserDto.password = hashedPassword
    }
    await user.update(updateUserDto);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id); // Use o findById que você já tem
    await user.destroy();
  }
}