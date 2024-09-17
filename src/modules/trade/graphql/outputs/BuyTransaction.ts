import { Field, ObjectType } from '@nestjs/graphql';
import { Snapshot } from 'src/modules/snapshot/graphql/outputs/Snapshot';

@ObjectType()
export class Transaction {
  @Field()
  id: string;

  @Field(() => Snapshot)
  snapshot: Snapshot;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
