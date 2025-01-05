import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceTypeDto } from './create-invoice-type.dto';

export class UpdateInvoiceTypeDto extends PartialType(CreateInvoiceTypeDto) {}