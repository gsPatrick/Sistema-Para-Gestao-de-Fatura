import { CreateAddressDto, Address } from './address';
import { CreatePersonClassificationDto, PersonClassification } from './person-classification';
import { Invoice } from './invoice';
import { StatusType } from './status-type';
import { PersonInvoiceWithInvoice } from './person-invoice'; // Importe a interface que 


// person.ts
export interface CreatePersonDto {
  fullname: string;
  nickname: string;
  statusTypeId: number;
  cellphone?: string;
  instagram?: string;
  enable: boolean;
  role?: 'admin' | 'user';
  addresses?: CreateAddressDto[];
  personClassifications?: CreatePersonClassificationDto[];
  // Adicionando campos para suportar uma fatura
  invoice?: {
    paid_at: string | null;
    cancelled_at: string | null;
    enable: boolean;
  };
}

export interface UpdatePersonDto {
  fullname?: string;
  nickname?: string;
  statusTypeId?: number;
  cellphone?: string;
  instagram?: string;
  enable?: boolean;
  role?: 'admin' | 'user';
  addresses?: CreateAddressDto[];
  personClassifications?: CreatePersonClassificationDto[];
  // Adicionando campos para suportar uma fatura
  invoice?: {
    paid_at: string | null;
    cancelled_at: string | null;
    enable: boolean;
  };
}

export interface Person {
  id: number;
  fullname: string;
  nickname: string;
  statusTypeId: number;
  cellphone?: string;
  instagram?: string;
  enable: boolean;
  role?: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  addresses: Address[]; // Use a interface Address, não CreateAddressDto
  personClassifications: PersonClassification[]; // Use a interface PersonClassification, não CreatePersonClassificationDto
  invoices: PersonInvoiceWithInvoice[]; // Adiciona as faturas associadas
  statusType: StatusType;
  
}