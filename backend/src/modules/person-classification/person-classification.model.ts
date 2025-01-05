import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Person } from '../person/person.model';
import { Classification } from '../classification/classification.model';

@Table({ tableName: 'person_classification' })
export class PersonClassification extends Model {
  @ForeignKey(() => Person)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  personId: number;

  @ForeignKey(() => Classification)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  classificationId: number;

  @BelongsTo(() => Person, { onDelete: 'CASCADE' }) // Adicione onDelete aqui
  person: Person;
  
  @BelongsTo(() => Classification)
  classification: Classification;
}