import { Field, ObjectType } from '@nestjs/graphql';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';
import { Snapshot } from './Snapshot';

@ObjectType()
export class SnapshotManyOutput {
  @Field(() => [Snapshot])
  snapshots: Snapshot[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
