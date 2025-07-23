import {
  BeforeSave,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Role } from '../services/users/role.enum';
import { logger } from '../config/winston.config';

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

  @BeforeSave
  static checkPasswordIsHashed(user: User) {
    const isLikelyHashed = user.password.startsWith('$2') && user.password.length >= 60;

    if (!isLikelyHashed) {
      logger.error(`User password is not hashed before save (email: ${user.email})`);
      throw new Error('Password must be hashed before saving.');
    }
  }
}
