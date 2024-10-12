import { Module } from '@nestjs/common';
import { UserResolver } from './graphql/user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from 'prisma/prisma.module';
import { InitUserService } from './init.user.service';

@Module({
  imports: [PrismaModule],
  providers: [UserResolver, UserService, InitUserService],
  exports: [UserService],
})
export class UserModule {}
