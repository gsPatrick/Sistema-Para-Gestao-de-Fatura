import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Person } from '../person/person.model';

@Table({ tableName: 'address' })
export class Address extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Person)
  @Column({
    type: DataType.INTEGER,
  })
  personId: number;

  @Column({
    type: DataType.DATE, // Usar DATE para armazenar a data e hora da exclusão
    allowNull: true,     // Permite valores nulos, indicando que o endereço não foi excluído
    field: 'deletedAt'
  })
  deletedAt: Date | null;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  zipcode: string;

  @Column({
    type: DataType.STRING,
  })
  street: string;

  @Column({
    type: DataType.STRING, // Ou DataType.NUMBER se precisar de precisão arbitrária
  })
  number: string;

  @Column({
    type: DataType.STRING, // Ou DataType.NUMBER
  })
  complement: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  enable: boolean;

  @BelongsTo(() => Person)
  person: Person;
}