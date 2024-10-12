import { Injectable } from '@nestjs/common';
import { TradeStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';

@Injectable()
export class TradeService {
  constructor(private readonly prisma: PrismaService) {}

  async createBuyTransaction(
    value: string,
    snapshotId: string,
    assetAddress: string,
    userId: string,
  ) {
    return this.prisma.buyTransaction.create({
      data: {
        value,
        snapshot: {
          connect: {
            id: snapshotId,
          },
        },
        trade: {
          create: {
            assetAddress,
            userId,
          },
        },
      },
    });
  }

  async createSellTransaction(
    value: any, //TODO type Decimal
    snapshotId: string,
    tradeId: string,
    transactionRuleId: string,
  ) {
    return this.prisma.sellTransaction.create({
      data: {
        value,
        snapshot: {
          connect: {
            id: snapshotId,
          },
        },
        trade: {
          connect: {
            id: tradeId,
          },
        },
        transactionRule: {
          connect: {
            id: transactionRuleId,
          },
        },
      },
    });
  }

  async findMany(args: FindManyArgs & { userId?: string }) {
    const { userId, ...findArgs } = args;

    const trades = await this.prisma.trade.findMany({
      ...findArgs,
      where: userId
        ? {
            userId,
          }
        : {},
      include: {
        asset: true,
        user: true,
        buyTransaction: {
          include: {
            snapshot: true,
          },
        },
        sellTransactions: {
          include: {
            snapshot: true,
          },
        },
      },
    });
    const total = await this.prisma.trade.count();

    return { trades, meta: { total } };
  }

  async findManyOngoingBuyedTradesByAddress(assetAddress: string) {
    return this.prisma.trade.findMany({
      where: {
        assetAddress,
        status: TradeStatus.ONGOING,
      },
      include: {
        buyTransaction: true,
      },
    });
  }

  async finishTrade(id: string) {
    await this.prisma.trade.update({
      where: {
        id,
      },
      data: {
        status: TradeStatus.FINISHED,
      },
    });
  }
}
