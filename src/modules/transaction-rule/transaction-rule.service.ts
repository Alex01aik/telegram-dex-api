import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TransactionRule, TransactionRuleType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { UpdateOneTransactionRuleArgs } from './graphql/args/UpdateOneTransactionRule';
import { CreateOneSellTransactionRuleArgs } from './graphql/args/CreateOneSellTransactionRule';

@Injectable()
export class TransactionRuleService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createOne(
    args: CreateOneSellTransactionRuleArgs & {
      type: TransactionRuleType;
    },
  ) {
    const isExist = await this.prisma.transactionRule.findFirst({
      where: {
        priceChange: {
          equals: args.priceChange,
        },
      },
    });
    if (isExist) {
      throw new BadRequestException('Transaction rule already exists');
    }

    if (
      (args.type === TransactionRuleType.STOP && args.transactionVolume) ||
      (args.type === TransactionRuleType.SELL && !args.transactionVolume)
    ) {
      throw new BadRequestException(
        'Transaction rule type and transaction volume  do not match',
      );
    }

    if (args.type === TransactionRuleType.STOP) {
      await this.cacheManager.del('stop-rule');
    } else {
      await this.cacheManager.del('sell-rules');
    }

    return this.prisma.transactionRule.create({
      data: {
        ...args,
      },
    });
  }

  async updateOne(args: UpdateOneTransactionRuleArgs) {
    const { id, ...updateArgs } = args;
    const rule = await this.prisma.transactionRule.findUnique({
      where: {
        id,
      },
    });
    if (rule.type === TransactionRuleType.STOP) {
      await this.cacheManager.del('stop-rule');
    } else {
      await this.cacheManager.del('sell-rules');
    }
    return this.prisma.transactionRule.update({
      where: {
        id,
      },
      data: {
        ...updateArgs,
      },
    });
  }

  async findMany(args: FindManyArgs) {
    const transactionRules = await this.prisma.transactionRule.findMany({
      ...args,
      orderBy: {
        priceChange: 'asc',
      },
    });
    const total = await this.prisma.trade.count();

    const stopRule = transactionRules.find(
      (i) => i.type === TransactionRuleType.STOP,
    );

    return {
      transactionRules: [
        stopRule,
        ...transactionRules.filter((i) => i.id !== stopRule.id),
      ],
      meta: { total },
    };
  }

  async findStopRule() {
    const cachedData: TransactionRule =
      await this.cacheManager.get('stop-rule');
    if (cachedData) {
      return cachedData;
    }
    const data = this.prisma.transactionRule.findFirst({
      where: {
        type: TransactionRuleType.STOP,
      },
    });

    await this.cacheManager.set('stop-rule', data);
    return data;
  }

  async findAllSellRules() {
    const cachedData: TransactionRule[] =
      await this.cacheManager.get('sell-rules');
    if (cachedData) {
      return cachedData;
    }

    const data = this.prisma.transactionRule.findMany({
      where: {
        type: TransactionRuleType.SELL,
      },
      orderBy: {
        priceChange: 'desc',
      },
    });

    await this.cacheManager.set('sell-rules', data);
    return data;
  }
}
