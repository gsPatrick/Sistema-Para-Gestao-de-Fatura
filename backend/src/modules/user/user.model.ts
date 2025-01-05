import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
      })
    id: number;

    @Column({
        type: DataType.STRING,
        field: 'fullname'
    })
    fullname: string;

    @Column({
        type: DataType.STRING,
        field: 'nickname'
    })
    nickname: string;

    @Column({
        type: DataType.STRING,
        field: 'email',
        unique: true
    })
    email: string;

    @Column({
        type: DataType.STRING,
        field: 'password'
    })
    password: string;

    @Column({
        type: DataType.ENUM('admin', 'user'), // Tipo ENUM para armazenar as roles
        allowNull: false,
        defaultValue: 'user', // Valor padrão é 'user'
      })
      role: string;
}