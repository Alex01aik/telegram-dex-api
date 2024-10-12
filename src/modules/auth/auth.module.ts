import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthResolver } from './graphql/auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.SECRET_KEY ?? 'jwt-secret',
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
