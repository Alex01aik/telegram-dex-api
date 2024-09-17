import { Field, ArgsType } from '@nestjs/graphql';
import { CreateOneSnapshotArgs } from './CreateOneSnapshot';
import { CreateOneAssetArgs } from 'src/modules/asset/graphql/args/CreateOneAssetArgs';
import { IsUUID } from 'class-validator';

@ArgsType()
export class CreateOneSnapshotWithAssetArgs {
  @IsUUID()
  @Field()
  informatorId: string;

  @Field()
  asset: CreateOneAssetArgs;

  @Field()
  snapshot: CreateOneSnapshotArgs;
}
