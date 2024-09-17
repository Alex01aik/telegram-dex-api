import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FindByUsernameArgs {
  @Field()
  userName: string;
}
