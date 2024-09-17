import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FindByTelegramIdArgs {
  @Field()
  telegramId: string;
}
