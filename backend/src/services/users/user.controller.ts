import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from './role.enum';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query('offset') offset: string = '0', @Query('limit') limit: string = '10') {
    return await this.usersService.findAllPaginated(Number(offset), Number(limit));
  }
}
