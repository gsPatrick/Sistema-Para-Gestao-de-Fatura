import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Person } from '../person/person.model';
import { Invoice } from '../invoice/invoice.model';

@Table({ tableName: 'person_invoice', timestamps: false })
export class PersonInvoice extends Model {
    @ForeignKey(() => Person)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    personId: number;

    @ForeignKey(() => Invoice)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    invoiceId: number;
}