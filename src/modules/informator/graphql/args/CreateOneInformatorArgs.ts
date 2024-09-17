import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateOneInformatorArgs {
  @Field()
  userName: string;

  @Field()
  telegramId: string;

  @Field({ nullable: true })
  isTrusted?: boolean;
}
