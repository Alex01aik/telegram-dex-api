import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Informator } from '@prisma/client';
import { DexService } from '../dex/dex.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { UserService } from '../user/user.service';
import { TradeService } from '../trade/trade.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly dexService: DexService,
    private readonly snapshotService: SnapshotService,
    private readonly userService: UserService,
    private readonly tradeService: TradeService,
  ) {}

  async processSnapshotChain(
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
      this.logger.warn(
        `Address "${assetAddress}" from ${informator.userName} informator is already being processed.`,
      );
      return;
    }

    this.logger.log(
      `Received new snapshot chain for address "${assetAddress}" from ${informator.userName} informator`,
    );

    const snapshot = await this.createSnapshot(assetAddress, informator);
    // TODO add informator.isTrusted
    if (snapshot) {
      await this.buyAsset(snapshot.id, assetAddress);
    }

    const intervalId = setInterval(
      async () => {
        const snapshot = await this.createSnapshot(assetAddress, informator);
        if (snapshot) {
          if (informator.isTrusted) {
            // TODO check price for sell
            // if (true) {
            //   await this.sellAsset(address);
            //   this.stopSnapshotChain(address, informator);
            // }
          } else {
            const now = new Date();
            const createdAt = snapshot.snapshotChain.createdAt;
            const dateDiff = now.getTime() - createdAt.getTime();
            if (
              dateDiff >=
              Number(process.env.MONITOR_TIME_IN_MINUTES ?? 10) * 60 * 1000
            ) {
              // TODO remove
              await this.sellAsset(snapshot.id, assetAddress);
              this.stopSnapshotChain(assetAddress, informator);
            }
          }
        }
      },
      Number(process.env.DEX_QUERY_INTERVAL_IN_MINUTES) * 60 * 1000,
    );

    this.schedulerRegistry.addInterval(snapshot.snapshotChain.id, intervalId);
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
      await this.snapshotService.endChain(ongoingSnapshotChain.id);
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
          priceInUsd: data.priceInUsd,
          priceSolInUsd: data.priceSolInUsd,
        },
      });

      this.logger.log(
        `Snapshot for "${assetAddress}" asset from ${informator.userName} informator is created`,
      );

      return snapshot;
    } catch (error) {
      this.logger.error(error);
      this.stopSnapshotChain(assetAddress, informator);
    }
  }

  async buyAsset(snapshotId: string, assetAddress: string) {
    const users = await this.userService.findManyAutoTrade();

    await Promise.all(
      users.map(
        async (user) =>
          await this.tradeService.createBuyTransaction(
            snapshotId,
            assetAddress,
            user.id,
          ),
      ),
    );

    this.logger.warn(`Buy asset ${assetAddress}`);
  }

  async sellAsset(snapshotId: string, assetAddress: string) {
    const ongoingTrades =
      await this.tradeService.findManyOngoingBuyedTradesByAddress(assetAddress);

    await Promise.all([
      ongoingTrades.map(async (trade) => {
        await this.tradeService.createSellTransaction(snapshotId, trade.id);
      }),
    ]);

    this.logger.warn(`Sell asset ${assetAddress}`);
  }
}
