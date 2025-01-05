import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './modules/address/address.model';
import { Person } from './modules/person/person.model';
import { StatusType } from './modules/status-type/status-type.model';
import { Invoice } from './modules/invoice/invoice.model';
import { InvoiceType } from './modules/invoice-type/invoice-type.model';
import { PersonClassification } from './modules/person-classification/person-classification.model';
import { Classification } from './modules/classification/classification.model';
import { User } from './modules/user/user.model';
import { AuthModule } from './modules/user/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { PersonModule } from './modules/person/person.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { SeederModule } from './seeder/seeder.module';
import { PersonInvoice } from './modules/person-invoice/person-invoice.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Carrega o .env e torna o ConfigModule global
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'rani',
      
      models: [
        Address,
        Person,
        StatusType,
        Invoice,
        InvoiceType,
        PersonClassification,
        Classification,
        User,
        PersonInvoice
      ],
      autoLoadModels: true,
      synchronize: true, //  <----  Altere para true
      logging: console.log,
    }),
    AuthModule,
    UsersModule,
    PersonModule,
    InvoiceModule,
    SeederModule
  ],
  controllers: [], 
})
export class AppModule {}