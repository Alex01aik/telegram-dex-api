import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateOneUserArgs {
  @Field()
  name: string;
}
