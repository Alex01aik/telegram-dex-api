import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class FindManyArgs {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}
