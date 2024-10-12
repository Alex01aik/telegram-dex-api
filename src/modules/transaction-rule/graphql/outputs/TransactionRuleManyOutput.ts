import { Field, ObjectType } from '@nestjs/graphql';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';
import { TransactionRule } from './TransactionRule';

@ObjectType()
export class TransactionRuleManyOutput {
  @Field(() => [TransactionRule])
  transactionRules: TransactionRule[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
