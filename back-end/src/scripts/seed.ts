import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from '../seeder/seeder.service';
import { INestApplicationContext } from '@nestjs/common';


async function bootstrap() {
    const app: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get<SeederService>(SeederService);
  
    console.log('Iniciando seeding...');
    try {
      await seederService.seed();
      console.log('Seeding completo!');
    } catch (error) {
      console.error('Erro ao executar o seeding:', error);
    } finally {
      await app.close();
    }
  }
  
  bootstrap();