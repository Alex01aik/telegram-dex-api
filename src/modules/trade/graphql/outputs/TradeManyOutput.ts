import { Field, ObjectType } from '@nestjs/graphql';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';
import { Trade } from './Trade';

@ObjectType()
export class TradeManyOutput {
  @Field(() => [Trade])
  trades: Trade[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
