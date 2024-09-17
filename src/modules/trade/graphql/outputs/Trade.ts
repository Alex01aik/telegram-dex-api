import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from 'src/modules/asset/graphql/outputs/Asset';
import { Transaction } from './BuyTransaction';

@ObjectType()
export class Trade {
  @Field()
  id: string;

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Transaction)
  buyTransaction: Transaction;

  @Field(() => Transaction, { nullable: true })
  sellTransaction?: Transaction;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
