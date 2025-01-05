import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { PersonClassification } from '../person-classification/person-classification.model';

@Table({ tableName: 'classification' })
export class Classification extends Model {
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
  tag: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  enable: boolean;

  @HasMany(() => PersonClassification)
  personClassifications: PersonClassification[];
}