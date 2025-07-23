import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../../models/User';
import { logger } from '../../config/winston.config';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './user.interfaces';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UserService {
  async findAllPaginated(offset = 0, limit = 10): Promise<{ data: User[]; total: number }> {
    const results = await User.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
    });
    return { data: results.rows, total: results.count };
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email: email } });
  }

  async create(data: CreateUserInput): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    try {
      const user = await User.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
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
}
