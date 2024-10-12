import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { TradeService } from '../trade.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { TradeManyOutput } from './outputs/TradeManyOutput';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guard/RoleGuard';
import { JwtGuard } from 'src/modules/auth/guard/JwtGuard';
import { Roles } from 'src/modules/auth/utils/RolesDecorator';
import { UserRole } from '@prisma/client';

@Resolver()
export class TradeResolver {
  constructor(private tradeService: TradeService) {}

  @UseGuards(JwtGuard)
  @Query(() => TradeManyOutput)
  async findManyTrades(
    @Args() args: FindManyArgs,
    @Context() ctx: any,
  ): Promise<TradeManyOutput> {
    return this.tradeService.findMany({ ...args, userId: ctx.req.user.id });
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => TradeManyOutput)
  async findManyTradesForAllUsers(
    @Args() args: FindManyArgs,
  ): Promise<TradeManyOutput> {
    return this.tradeService.findMany(args);
  }
}
