import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TradeService } from '../trade/trade.service';
import { TradeResolver } from './graphql/trade.resolver';

@Module({
  imports: [PrismaModule],
  providers: [TradeService, TradeResolver],
  exports: [TradeService],
})
export class TradeModule {}
