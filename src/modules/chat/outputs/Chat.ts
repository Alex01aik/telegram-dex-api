import { Field, ObjectType } from '@nestjs/graphql';
import { Informator } from 'src/modules/informator/graphql/outputs/Informator';
import { ChatRate } from './ChatRate';

@ObjectType()
export class Chat {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  telegramId: string;

  @Field(() => [Informator])
  informators?: Informator[];

  @Field(() => ChatRate, { nullable: true })
  rate?: ChatRate;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
