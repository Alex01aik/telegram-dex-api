import { Field, ObjectType } from '@nestjs/graphql';
import { InformatorRate } from './InformatorRate';

@ObjectType()
export class Informator {
  @Field()
  id: string;

  @Field()
  userName: string;

  @Field(() => InformatorRate, { nullable: true })
  rate?: InformatorRate;

  @Field()
  isTrusted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
