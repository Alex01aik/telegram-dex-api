import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class KeyArgs {
  @Field()
  key: string;
}
