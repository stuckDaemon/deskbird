import { Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Role } from '../services/users/role.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
  })
  declare role: Role;
}
