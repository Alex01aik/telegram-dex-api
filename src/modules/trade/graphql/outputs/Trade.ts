import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from 'src/modules/asset/graphql/outputs/Asset';
import { Transaction } from './BuyTransaction';
import { User } from 'src/modules/user/graphql/outputs/User';

@ObjectType()
export class Trade {
  @Field()
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Transaction)
  buyTransaction: Transaction;

  @Field(() => [Transaction])
  sellTransactions: Transaction[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
