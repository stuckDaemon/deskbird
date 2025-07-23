import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../services/users/user.service';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../models/User';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService suite', () => {
  let service: AuthService;
  let usersService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    const loginDto: LoginDto = { email: 'test@example.com', password: 'plaintext-pass' };

    it('should return user if credentials are valid', async () => {
      const mockUser = { id: '1', email: loginDto.email, password: 'hashed', role: 'user' } as User;
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(loginDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user is not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is incorrect', async () => {
      const mockUser = { id: '1', email: loginDto.email, password: 'hashed', role: 'user' } as User;
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'plaintext-pass' };
      const mockUser = { id: '1', role: 'user', password: 'hashed', email: loginDto.email } as User;

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', role: 'user' });
    });
  });
});
