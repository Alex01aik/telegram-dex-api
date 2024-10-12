import { Field, ArgsType, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
@InputType()
export class UpdateOneTransactionRuleArgs {
  @IsUUID()
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  priceChange?: string;

  @Field(() => String, { nullable: true })
  transactionVolume?: string;
}
