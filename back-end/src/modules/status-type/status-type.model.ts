import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Person } from '../person/person.model';

@Table({ tableName: 'status_type' })
export class StatusType extends Model {
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

  @HasMany(() => Person)
  persons: Person[];
}