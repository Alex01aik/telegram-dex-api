import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TransactionRuleType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InitTransactionRuleService implements OnModuleInit {
  private readonly logger = new Logger(InitTransactionRuleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const isExistSellRule = await tx.transactionRule.findFirst({
          where: {
            type: TransactionRuleType.SELL,
          },
        });
        if (!isExistSellRule) {
          await tx.transactionRule.create({
            data: {
              priceChange: 2,
              transactionVolume: 0.5,
              type: TransactionRuleType.SELL,
            },
          });
        }

        const isExistStopRule = await tx.transactionRule.findFirst({
          where: {
            type: TransactionRuleType.STOP,
          },
        });
        if (!isExistStopRule) {
          await tx.transactionRule.create({
            data: {
              priceChange: 0.33,
              type: TransactionRuleType.STOP,
            },
          });
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
