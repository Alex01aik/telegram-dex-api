import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RegisterArgs {
  @Field()
  name: string;

  @Field()
  login: string;

  @Field()
  password: string;
}
