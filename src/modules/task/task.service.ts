import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Informator } from '@prisma/client';
import { DexService } from '../dex/dex.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { UserService } from '../user/user.service';
import { TradeService } from '../trade/trade.service';
import { TransactionRuleService } from '../transaction-rule/transaction-rule.service';
import { ChatRateService } from '../chat/chat.rate.service';
import { InformatorRateService } from '../informator/informator.rate.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly dexService: DexService,
    private readonly snapshotService: SnapshotService,
    private readonly userService: UserService,
    private readonly tradeService: TradeService,
    private readonly transactionRuleService: TransactionRuleService,
    private readonly informatorRateService: InformatorRateService,
    private readonly chatRateService: ChatRateService,
  ) {}

  async processSnapshotChain(
    assetAddress: string,
    informator: Informator,
    chatTelegramId: string,
  ): Promise<void> {
    const ongoingSnapshotChain = await this.snapshotService.findOneOngoingChain(
      {
        assetAddress,
        informatorId: informator.id,
      },
    );

    if (ongoingSnapshotChain) {
      this.logger.warn(
        `Address "${assetAddress}" from ${informator.userName} informator is already being processed.`,
      );
      return;
    }

    this.logger.log(
      `Received new snapshot chain for address "${assetAddress}" from ${informator.userName} informator`,
    );

    const snapshot = await this.createSnapshot(assetAddress, informator);
    if (snapshot && informator.isTrusted) {
      // TODO 1 value -> calculate value from liquidity
      const buyValue = snapshot.price.mul(1).toString();
      await this.buyAsset(buyValue, assetAddress, snapshot.id);
    }

    const intervalId = setInterval(
      async () => {
        await this.chainAction(assetAddress, informator, chatTelegramId);
      },
      Number(process.env.DEX_QUERY_INTERVAL_IN_MINUTES) * 60 * 1000,
    );

    this.schedulerRegistry.addInterval(snapshot.snapshotChain.id, intervalId);
  }

  async chainAction(
    assetAddress: string,
    informator: Informator,
    chatTelegramId: string,
  ) {
    const snapshot = await this.createSnapshot(assetAddress, informator);
    if (snapshot) {
      const sellRules = await this.transactionRuleService.findAllSellRules();
      const stopRule = await this.transactionRuleService.findStopRule();

      const isEndListen = this.calculateIsEndListen(
        snapshot.snapshotChain.createdAt,
      );

      const firstSnapshot =
        await this.snapshotService.findFirstSnapshotByChainId(
          snapshot.snapshotChainId,
        );

      const lastSellTransactionWithSnapshot =
        await this.snapshotService.findLastSellTransactionWithRuleByChainId(
          snapshot.snapshotChainId,
        );

      const faleCondition =
        isEndListen ||
        snapshot.price
          .div(firstSnapshot.price)
          .lessThanOrEqualTo(new Decimal(1).minus(stopRule.priceChange));

      if (faleCondition) {
        await this.stopSnapshotChain(assetAddress, informator);
        if (!lastSellTransactionWithSnapshot) {
          await Promise.all([
            this.informatorRateService.riseInformatorFales(informator.id),
            this.chatRateService.riseChatFales(chatTelegramId),
          ]);
        }
      } else {
        const lastPotentialSellRule = sellRules.find((rule) =>
          snapshot.price
            .div(firstSnapshot.price)
            .greaterThanOrEqualTo(rule.priceChange),
        );

        if (lastPotentialSellRule) {
          if (!lastSellTransactionWithSnapshot) {
            await Promise.all([
              this.informatorRateService.riseInformatorSuccesses(informator.id),
              this.chatRateService.riseChatSuccesses(chatTelegramId),
            ]);
          }

          if (informator.isTrusted) {
            if (!lastSellTransactionWithSnapshot) {
              // first buy
              await this.sellAsset(
                lastPotentialSellRule.transactionVolume,
                assetAddress,
                snapshot.id,
                lastPotentialSellRule.id,
              );
            } else {
              // another buy
              const newSellCondition =
                lastSellTransactionWithSnapshot.transactionRule.priceChange.lessThan(
                  lastPotentialSellRule.priceChange,
                );

              if (newSellCondition) {
                await this.sellAsset(
                  lastPotentialSellRule.transactionVolume,
                  assetAddress,
                  snapshot.id,
                  lastPotentialSellRule.id,
                );
              }
            }
          }
        }
      }
    }
  }

  calculateIsEndListen(createdAt: Date) {
    const now = new Date();
    const dateDiff = now.getTime() - createdAt.getTime();
    return (
      dateDiff >= Number(process.env.MONITOR_TIME_IN_MINUTES ?? 10) * 60 * 1000
    );
  }

  async stopSnapshotChain(
    assetAddress: string,
    informator: Informator,
  ): Promise<void> {
    const ongoingSnapshotChain = await this.snapshotService.findOneOngoingChain(
      {
        assetAddress,
        informatorId: informator.id,
      },
    );

    if (ongoingSnapshotChain) {
      await Promise.all([
        this.snapshotService.endChain(ongoingSnapshotChain.id),
        this.finishTrades(assetAddress),
      ]);
      clearInterval(ongoingSnapshotChain.id);

      this.schedulerRegistry.deleteInterval(ongoingSnapshotChain.id);
      this.logger.log(
        `Stopped logging for address "${assetAddress}" from ${informator.userName} informator`,
      );
    } else {
      this.logger.warn(
        `Address "${assetAddress}" from ${informator.userName} informator is not being logged.`,
      );
    }
  }

  async createSnapshot(assetAddress: string, informator: Informator) {
    try {
      const data = await this.dexService.getInfoByAddress(assetAddress);
      const snapshot = await this.snapshotService.createOneSnapshotWithAsset({
        asset: {
          address: assetAddress,
          name: data.name,
          fullName: data.fullName,
          logo: data.logo,
        },
        informatorId: informator.id,
        snapshot: {
          price: data.price,
          liquidity: data.liquidity,
        },
      });

      this.logger.log(
        `Snapshot for "${assetAddress}" asset from ${informator.userName} informator is created. Price is "${snapshot.price}"`,
      );

      return snapshot;
    } catch (error) {
      this.logger.error(error);
      await this.stopSnapshotChain(assetAddress, informator);
    }
  }

  async buyAsset(value: string, assetAddress: string, snapshotId: string) {
    const users = await this.userService.findManyAutoTrade();

    await Promise.all(
      users.map(
        async (user) =>
          await this.tradeService.createBuyTransaction(
            value,
            snapshotId,
            assetAddress,
            user.id,
          ),
      ),
    );

    this.logger.warn(`Buy asset ${assetAddress} with "${value}" value`);
  }

  async sellAsset(
    multiplicator: any,
    assetAddress: string,
    snapshotId: string,
    transactionRuleId: string,
  ) {
    const ongoingTrades =
      await this.tradeService.findManyOngoingBuyedTradesByAddress(assetAddress);

    await Promise.all([
      ongoingTrades.map(async (trade) => {
        await this.tradeService.createSellTransaction(
          trade.buyTransaction.value.mul(multiplicator),
          snapshotId,
          trade.id,
          transactionRuleId,
        );
      }),
    ]);

    this.logger.warn(
      `Sell asset ${assetAddress} with "${multiplicator}" multiplicator`,
    );
  }

  async finishTrades(assetAddress: string) {
    const ongoingTrades =
      await this.tradeService.findManyOngoingBuyedTradesByAddress(assetAddress);

    await Promise.all([
      ongoingTrades.map(async (trade) => {
        await this.tradeService.finishTrade(trade.id);
      }),
    ]);
  }
}
