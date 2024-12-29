import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'; // Importe RequestMethod
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users.module';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'sua-chave-secreta-super-forte', // Chave secreta aqui
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST }, // Exclui a rota de cadastro
        { path: 'auth/login', method: RequestMethod.POST },    // Exclui a rota de login
      )
      .forRoutes('*'); // Aplica a todas as outras rotas
  }
}