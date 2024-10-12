import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class LoginArgs {
  @Field()
  login: string;

  @Field()
  password: string;
}
