import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Invoice } from '../invoice/invoice.model';

@Table({ tableName: 'invoice_type' })
export class InvoiceType extends Model {
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

  @Column({
    type: DataType.BOOLEAN,
  })
  enable: boolean;

  @HasMany(() => Invoice)
  invoices: Invoice[];
}