import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from './role.enum';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UpdateUserDto } from './user.interfaces';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll(@Query('offset') offset: string = '0', @Query('limit') limit: string = '10') {
    return await this.usersService.findAllPaginated(Number(offset), Number(limit));
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
