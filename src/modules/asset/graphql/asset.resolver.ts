import { Resolver, Query, Args } from '@nestjs/graphql';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { AssetService } from '../asset.service';
import { AssetManyOutput } from './outputs/AssetManyOutput';

@Resolver()
export class AssetResolver {
  constructor(private assetService: AssetService) {}

  @Query(() => AssetManyOutput)
  async findManyAssets(@Args({ nullable: true }) args?: FindManyArgs) {
    return this.assetService.findMany(args);
  }
}
