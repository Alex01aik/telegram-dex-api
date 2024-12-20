import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FindManyMeta {
  @Field(() => Int)
  total: number;
}
