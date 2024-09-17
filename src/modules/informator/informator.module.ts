import { Module } from '@nestjs/common';
import { InformatorResolver } from './graphql/informator.resolver';
import { InformatorService } from './informator.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InformatorResolver, InformatorService],
  exports: [InformatorService],
})
export class InformatorModule {}
