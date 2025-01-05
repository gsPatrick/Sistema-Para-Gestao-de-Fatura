import { Person } from './person'; // Importe a interface Person, se necessário
import { InvoiceType } from './invoice-type'; // Importe a interface InvoiceType, se necessário
import { PersonInvoiceWithInvoice } from './person-invoice'; // Importe a interface

export interface Invoice {
  id: number;
  name: string;
  code: string;
  invoiceTypeId: number;
  fullvalue: number;
  discount: number;
  amountPaid: number;
  createdAt: string; // Ou Date, se preferir
  startBillingOn: string | null; // Ou Date, se preferir
  updatedAt: string; // Ou Date
  persons?: Person[]; // Array opcional de Person, para quando você carregar as pessoas associadas
  invoiceType?: InvoiceType; // Tipo da fatura (opcional, para quando você carregar o tipo de fatura)
  personInvoices: PersonInvoiceWithInvoice[]; // Adicione essa linha para ter acesso aos dados de PersonInvoice
  }

export interface CreateInvoiceDto {
    name: string;
    code: string;
    invoiceTypeId: number;
    fullvalue: number;
    discount?: number; // Opcional
    amountPaid?: number; // Opcional
    personId?: number; // Opcional, para associar a uma pessoa na criação
    startBillingOn?: string | Date | null; // Adicionado como opcional
  }
  

export interface UpdateInvoiceDto {
  name?: string;
  code?: string;
  invoiceTypeId?: number;
  fullvalue?: number;
  discount?: number;
  amountPaid?: number;
  personId?: number; // Opcional
  startBillingOn?: string | Date | null; 
}