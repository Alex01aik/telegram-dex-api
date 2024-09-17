import { Resolver, Query, Args } from '@nestjs/graphql';
import { TradeService } from '../trade.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { TradeManyOutput } from './outputs/TradeManyOutput';

@Resolver()
export class TradeResolver {
  constructor(private tradeService: TradeService) {}

  @Query(() => TradeManyOutput)
  async findManyTrades(@Args() args: FindManyArgs): Promise<TradeManyOutput> {
    return this.tradeService.findMany(args);
  }
}
