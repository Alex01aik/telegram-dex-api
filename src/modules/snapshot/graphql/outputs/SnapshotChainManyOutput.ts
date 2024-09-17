import { Field, ObjectType } from '@nestjs/graphql';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';
import { SnapshotChain } from './SnapshotChain';

@ObjectType()
export class SnapshotChainManyOutput {
  @Field(() => [SnapshotChain])
  snapshotChains: SnapshotChain[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
