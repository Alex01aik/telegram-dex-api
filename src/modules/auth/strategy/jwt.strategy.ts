import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY ?? 'jwt-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.userId);
    const expirationDate = new Date(payload.exp * 1000);
    const currentDate = new Date();

    if (expirationDate < currentDate || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
