import { Invoice } from './invoice'; // Importe a interface Invoice


export interface PersonInvoice {
    personId: number;
    invoiceId: number;
    paid_at: string | null;
    cancelled_at: string | null;
    enable: boolean;
  }

  export interface PersonInvoiceWithInvoice extends PersonInvoice {
    invoice: Invoice;
  }
  