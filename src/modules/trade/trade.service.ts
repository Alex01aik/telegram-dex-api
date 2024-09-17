import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';

@Injectable()
export class TradeService {
  constructor(private readonly prisma: PrismaService) {}

  async createBuyTransaction(
    snapshotId: string,
    assetAddress: string,
    userId: string,
  ) {
    return this.prisma.buyTransaction.create({
      data: {
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

  async createSellTransaction(snapshotId: string, tradeId: string) {
    return this.prisma.sellTransaction.create({
      data: {
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
      },
    });
  }

  async findMany(args: FindManyArgs) {
    const trades = await this.prisma.trade.findMany({
      ...args,
      include: {
        asset: true,
        buyTransaction: {
          include: {
            snapshot: true,
          },
        },
        sellTransaction: {
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
        sellTransaction: null,
      },
    });
  }
}
