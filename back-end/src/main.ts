import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS com as opções desejadas
  app.use(cors({
    origin: 'http://localhost:3001', // Permitir apenas solicitações do frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permitir envio de cookies (se necessário)
  }));

  await app.listen(3000); // A porta em que o backend vai rodar (3001, diferente do frontend)
}
bootstrap();