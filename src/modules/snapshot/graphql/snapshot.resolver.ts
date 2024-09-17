import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { SnapshotService } from '../snapshot.service';
import { Snapshot } from './outputs/Snapshot';
import { CreateOneSnapshotWithAssetArgs } from './args/CreateOneSnapshotWithAssetArgs';
import { SnapshotManyOutput } from './outputs/SnapshotManyOutput';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { SnapshotChainManyOutput } from './outputs/SnapshotChainManyOutput';

@Resolver()
export class SnapshotResolver {
  constructor(private snapshotService: SnapshotService) {}

  @Mutation(() => Snapshot)
  async createOneSnapshot(
    @Args() args: CreateOneSnapshotWithAssetArgs,
  ): Promise<Snapshot> {
    return this.snapshotService.createOneSnapshotWithAsset(args);
  }

  @Query(() => SnapshotManyOutput)
  async findManySnapshots(
    @Args() args?: FindManyArgs,
  ): Promise<SnapshotManyOutput> {
    return await this.snapshotService.findMany(args);
  }

  @Query(() => SnapshotChainManyOutput)
  async findManySnapshotChains(
    @Args() args?: FindManyArgs,
  ): Promise<SnapshotChainManyOutput> {
    return await this.snapshotService.findManyChains(args);
  }
}
