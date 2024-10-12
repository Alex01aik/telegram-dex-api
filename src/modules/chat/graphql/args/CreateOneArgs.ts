import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateOneChatArgs {
  @Field()
  telegramId: string;
}
