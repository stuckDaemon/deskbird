import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/User';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseTestConfig } from '../../config/database/database.test.config';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeAll(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user if email and password are correct', async () => {
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashed', role: 'user' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'plain-password');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('notfound@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashed', role: 'user' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrong-password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: '1', role: 'user' };
      const result = await service.login(mockUser as any);
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', role: 'user' });
    });
  });
});
