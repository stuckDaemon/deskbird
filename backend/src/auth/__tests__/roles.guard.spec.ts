import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new RolesGuard(reflector as Reflector);
  });

  const mockContext = (role: string) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow if no roles are required (no @Roles decorator)', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const context = mockContext('user');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow if user has matching role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const context = mockContext('admin');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny if user role does not match required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const context = mockContext('user');
    expect(guard.canActivate(context)).toBe(false);
  });
});
