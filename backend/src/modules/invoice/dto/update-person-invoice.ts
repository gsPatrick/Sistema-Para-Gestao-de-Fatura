// Create a new DTO for updating PersonInvoice
// update-person-invoice.dto.ts
export class UpdatePersonInvoiceDto {
    paid_at?: string | null;
    cancelled_at?: string | null;
    enable?: boolean;
  }