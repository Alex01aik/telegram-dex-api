import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from 'src/modules/asset/graphql/outputs/Asset';
import { Informator } from 'src/modules/informator/graphql/outputs/Informator';
import { Snapshot } from './Snapshot';

@ObjectType()
export class SnapshotChain {
  @Field()
  id: string;

  @Field({ nullable: true })
  endAt?: Date;

  @Field(() => [Snapshot])
  snapshots: Snapshot[];

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Informator)
  informator: Informator;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
