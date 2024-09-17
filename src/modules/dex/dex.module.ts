import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DexService } from './dex.service';

@Module({
  imports: [PrismaModule],
  providers: [DexService],
  exports: [DexService],
})
export class DexModule {}
