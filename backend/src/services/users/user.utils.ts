import { SafeUser } from './user.interfaces';
import { User } from '../../models/User';

export const mapToSafeUser = (users: User[]): SafeUser[] => {
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  })) as SafeUser[];
};
