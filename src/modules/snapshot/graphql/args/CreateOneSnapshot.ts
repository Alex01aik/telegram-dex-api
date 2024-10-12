import { Field, ArgsType, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class CreateOneSnapshotArgs {
  @Field(() => String, { nullable: true })
  price?: string;

  @Field(() => String, { nullable: true })
  liquidity?: string;
}
