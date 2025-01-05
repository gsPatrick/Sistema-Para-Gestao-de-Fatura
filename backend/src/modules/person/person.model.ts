import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { StatusType } from '../status-type/status-type.model';
import { Address } from '../address/address.model';
import { Invoice } from '../invoice/invoice.model';
import { PersonClassification } from '../person-classification/person-classification.model';
import { PersonInvoice } from '../person-invoice/person-invoice.model';

@Table({ tableName: 'person' })
export class Person extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  fullname: string;

  @Column({
    type: DataType.STRING,
  })
  nickname: string;

  @ForeignKey(() => StatusType)
  @Column({
    type: DataType.INTEGER,
  })
  statusTypeId: number;

  @Column({
    type: DataType.STRING,
  })
  cellphone: string;

  @Column({
    type: DataType.STRING,
  })
  instagram: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  enable: boolean;

  @BelongsTo(() => StatusType)
  statusType: StatusType;

  @HasMany(() => Address, { onDelete: 'CASCADE' }) 
  addresses: Address[];

  // Adicione onDelete: 'CASCADE' aqui:
  @BelongsToMany(() => Invoice, {
    through: () => PersonInvoice,
    onDelete: 'CASCADE', 
  })
  invoices: Invoice[];

  @HasMany(() => PersonClassification, { onDelete: 'CASCADE' })
  personClassifications: PersonClassification[];
}
