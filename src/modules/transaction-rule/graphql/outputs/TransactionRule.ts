import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionRuleType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

registerEnumType(TransactionRuleType, {
  name: 'TransactionRuleType',
});

@ObjectType()
export class TransactionRule {
  @Field()
  id: string;

  @Field(() => String)
  priceChange: Decimal;

  @Field(() => String, { nullable: true })
  transactionVolume?: Decimal;

  @Field(() => TransactionRuleType)
  type: TransactionRuleType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
