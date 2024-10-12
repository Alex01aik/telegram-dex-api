import { Field, ArgsType, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class CreateOneSellTransactionRuleArgs {
  @Field()
  priceChange: string;

  @Field({ nullable: true })
  transactionVolume?: string;
}
