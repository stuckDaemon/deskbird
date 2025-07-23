import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, SafeUser } from './jwt.interface';
import { UserService } from '../services/users/user.service';
import { Role } from '../services/users/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_this_secret', // ⚠️ WARNING: Do not use default secret in production!
    });
  }

  /**
   * Hydrates the user from DB to ensure the user still exists and is authorized.
   * This is required for robust role-based access and future audit logging.
   */
  async validate(payload: JwtPayload): Promise<SafeUser> {
    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (!Object.values(Role).includes(payload.role)) {
      throw new UnauthorizedException('Invalid role');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async refreshToken(token: string) {
    // TODO: implement refresh token logic
  }
}
