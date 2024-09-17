import { Module } from '@nestjs/common';
import { UserResolver } from './graphql/user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}