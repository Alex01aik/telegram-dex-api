import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InformatorRate {
  @Field()
  id: string;

  @Field()
  successes: number;

  @Field()
  fales: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
