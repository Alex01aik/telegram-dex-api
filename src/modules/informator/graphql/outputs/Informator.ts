import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Informator {
  @Field()
  id: string;

  @Field()
  userName: string;

  @Field()
  isTrusted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
