import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { Role } from './role.enum';

export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  role: Role;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string;

  @IsInt()
  @Min(1)
  @Min(120)
  age: number;
}
