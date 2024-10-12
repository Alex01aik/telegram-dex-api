import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { RegisterArgs } from './graphql/args/RegisterArgs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async getUserIdByRefreshToken(token: string): Promise<string> {
    if (!token) {
      throw new UnauthorizedException();
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.SECRET_KEY ?? 'jwt-secret',
    );

    if (
      typeof decodedToken === 'string' ||
      decodedToken.tokenType !== 'refresh'
    ) {
      throw new UnauthorizedException();
    }

    const userId = (decodedToken as any)?.userId;
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentDate = new Date();

    if (expirationDate < currentDate || !userId) {
      throw new UnauthorizedException();
    }

    return userId;
  }

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByLogin(login);

    if (user && (await bcrypt.compare(password, user.hash))) {
      return user;
    }
    return null;
  }

  async createUser(args: RegisterArgs) {
    const { password, ...data } = args;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userService.create({ ...data, hash: hashedPassword });
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userService.findOneById(userId);
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = { userId: user.id, role: user.role };
    const refreshTokenPayload = { userId: user.id, tokenType: 'refresh' };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '5s',
    });

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
