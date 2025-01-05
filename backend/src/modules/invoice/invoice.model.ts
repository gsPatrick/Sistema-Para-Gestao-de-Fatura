import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Person } from '../person/person.model';
import { InvoiceType } from '../invoice-type/invoice-type.model';
import { PersonInvoice } from '../person-invoice/person-invoice.model';

@Table({ tableName: 'invoice' })
export class Invoice extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  code: string;

  @ForeignKey(() => InvoiceType)
  @Column({
    type: DataType.INTEGER,
  })
  invoiceTypeId: string;

  @Column({
    type: DataType.DECIMAL,
  })
  fullvalue: string;

  @Column({
    type: DataType.DECIMAL,
  })
  discount: string;

  @Column({
    type: DataType.DECIMAL,
  })
  amountPaid: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  startBillingOn: string;

  @Column({
    type: DataType.STRING,
  })
  paid_at: string;

  @Column({
    type: DataType.STRING,
  })
  cancelled_at: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  enable: boolean;

  @BelongsTo(() => InvoiceType)
  invoiceType: InvoiceType;

  @BelongsToMany(() => Person, () => PersonInvoice)
  persons: Person[];
}
