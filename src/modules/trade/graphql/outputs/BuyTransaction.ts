import { Field, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { Snapshot } from 'src/modules/snapshot/graphql/outputs/Snapshot';

@ObjectType()
export class Transaction {
  @Field()
  id: string;

  @Field(() => String)
  value: Decimal;

  @Field(() => Snapshot)
  snapshot: Snapshot;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
