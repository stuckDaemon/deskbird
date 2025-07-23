import { Role } from '../services/users/role.enum';

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface SafeUser {
  id: string;
  email: string;
  role: Role;
}
