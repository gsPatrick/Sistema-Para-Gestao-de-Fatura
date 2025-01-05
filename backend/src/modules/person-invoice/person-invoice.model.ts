import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
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

    // Adicionando os campos paid_at, cancelled_at e enable
    @Column({
        type: DataType.DATE, // Use DATE se quiser armazenar data e hora
        allowNull: true,
    })
    paid_at: Date | null;

    @Column({
        type: DataType.DATE, // Use DATE se quiser armazenar data e hora
        allowNull: true,
    })
    cancelled_at: Date | null;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Define como true por padrão
    })
    enable: boolean;

    // Relacionamentos - Útil para carregar os dados da Pessoa e da Fatura
    @BelongsTo(() => Person)
    person: Person;

    @BelongsTo(() => Invoice)
    invoice: Invoice;
}