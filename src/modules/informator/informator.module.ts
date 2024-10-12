import { Module } from '@nestjs/common';
import { InformatorResolver } from './graphql/informator.resolver';
import { InformatorService } from './informator.service';
import { PrismaModule } from 'prisma/prisma.module';
import { InformatorRateService } from './informator.rate.service';

@Module({
  imports: [PrismaModule],
  providers: [InformatorResolver, InformatorService, InformatorRateService],
  exports: [InformatorService, InformatorRateService],
})
export class InformatorModule {}
