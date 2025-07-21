import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './role.enum';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    return await this.usersService.findAll();
  }
}
