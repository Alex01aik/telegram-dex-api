import { Field, ArgsType, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class CreateOneAssetArgs {
  @Field()
  address: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  logo?: string;
}
