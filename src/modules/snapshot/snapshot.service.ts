import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOneSnapshotArgs } from './graphql/args/CreateOneSnapshot';
import { AssetService } from '../asset/asset.service';
import { CreateOneSnapshotWithAssetArgs } from './graphql/args/CreateOneSnapshotWithAssetArgs';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { SnapshotManyOutput } from './graphql/outputs/SnapshotManyOutput';
import { SnapshotChainManyOutput } from './graphql/outputs/SnapshotChainManyOutput';

export type FindOneOngoingChainArgs = {
  assetAddress: string;
  informatorId: string;
};

@Injectable()
export class SnapshotService {
  constructor(
    private readonly prisma: PrismaService,
    private assetService: AssetService,
  ) {}

  async createOneSnapshotWithAsset(data: CreateOneSnapshotWithAssetArgs) {
    const isAssetExist = await this.assetService.findOneByAddress(
      data.asset.address,
    );
    if (!isAssetExist) {
      await this.assetService.create(data.asset);
    }

    const snapshot = await this.create(
      data.snapshot,
      data.asset.address,
      data.informatorId,
    );

    return snapshot;
  }

  async create(
    snapshot: CreateOneSnapshotArgs,
    assetAddress: string,
    informatorId: string,
  ) {
    const ongoingSnapshotChain = await this.findOneOngoingChain({
      assetAddress,
      informatorId,
    });

    if (ongoingSnapshotChain) {
      return this.prisma.snapshot.create({
        data: {
          ...snapshot,
          snapshotChain: {
            connect: {
              informatorId_assetAddress_createdAt: {
                assetAddress,
                informatorId,
                createdAt: ongoingSnapshotChain.createdAt,
              },
            },
          },
        },
        include: { snapshotChain: true },
      });
    } else {
      return this.prisma.snapshot.create({
        data: {
          ...snapshot,
          snapshotChain: {
            create: {
              assetAddress,
              informatorId,
            },
          },
        },
        include: { snapshotChain: true },
      });
    }
  }

  async findMany(args?: FindManyArgs): Promise<SnapshotManyOutput> {
    const snapshots = await this.prisma.snapshot.findMany(args);
    const total = await this.prisma.snapshot.count();
    return { snapshots, meta: { total } };
  }

  async findManyChains(args?: FindManyArgs): Promise<SnapshotChainManyOutput> {
    const snapshotChains = await this.prisma.snapshotChain.findMany({
      ...args,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        snapshots: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        asset: true,
        informator: true,
      },
    });
    const total = await this.prisma.snapshotChain.count();
    return { snapshotChains, meta: { total } };
  }

  async findOneOngoingChain(args: FindOneOngoingChainArgs) {
    return await this.prisma.snapshotChain.findFirst({
      where: {
        ...args,
        endAt: null,
      },
    });
  }

  async endChain(id: string) {
    return await this.prisma.snapshotChain.update({
      where: {
        id,
      },
      data: {
        endAt: new Date(),
      },
    });
  }

  async findFirstSnapshotByChainId(id: string) {
    return this.prisma.snapshot.findFirst({
      where: {
        snapshotChainId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findLastSellTransactionWithRuleByChainId(id: string) {
    return this.prisma.sellTransaction.findFirst({
      where: {
        snapshot: {
          snapshotChainId: id,
        },
      },
      orderBy: {
        snapshot: {
          price: 'desc',
        },
      },
      include: {
        transactionRule: true,
      },
    });
  }
}
