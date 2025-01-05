import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS com as opções desejadas
  app.enableCors({
    origin: 'http://localhost:3001', // Permitir apenas solicitações do frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permitir envio de cookies (se necessário)
  });

  await app.listen(3000); // A porta em que o backend vai rodar
}
bootstrap();