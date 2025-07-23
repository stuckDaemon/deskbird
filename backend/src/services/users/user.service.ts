import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../../models/User';
import { logger } from '../../config/winston.config';
import * as bcrypt from 'bcrypt';
import { CreateUserInput, SafeUser, UpdateUserDto } from './user.interfaces';
import { UniqueConstraintError } from 'sequelize';
import { Role } from './role.enum';
import { mapToSafeUser } from './user.utils';

@Injectable()
export class UserService {
  async findAllPaginated(offset = 0, limit = 10): Promise<{ data: SafeUser[]; total: number }> {
    const results = await User.findAndCountAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'age', 'role', 'createdAt'],
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
    });

    const data = mapToSafeUser(results.rows);
    return { data: data, total: results.count };
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email: email } });
    } catch (error) {
      logger.error(`Error finding the user with email ${email}`);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      logger.debug(`Error finding user by ID ${id}`);
      throw error;
    }
  }

  async create(data: CreateUserInput): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    try {
      const user = await User.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
      });

      logger.info(`Created user with email: ${data.email} and role: ${data.role}`);
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('Email already exists');
      }

      logger.error(error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const userToEdit = await this.findById(id);
    if (!userToEdit) {
      throw new ConflictException('User not found');
    }

    if (userToEdit.role !== Role.User) {
      throw new ForbiddenException('Admins can only edit users with role "user"');
    }
    await userToEdit.update(updateUserDto);
  }
}
