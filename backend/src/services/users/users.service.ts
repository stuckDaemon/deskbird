import { Injectable } from '@nestjs/common';
import { User } from '../../models/User';

@Injectable()
export class UsersService {
  async findAll() {
    return await User.findAll();
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email: email } });
  }
}
