import { Field, ObjectType } from '@nestjs/graphql';
import { Chat } from './Chat';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';

@ObjectType()
export class ChatManyOutput {
  @Field(() => [Chat])
  chats: Chat[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
