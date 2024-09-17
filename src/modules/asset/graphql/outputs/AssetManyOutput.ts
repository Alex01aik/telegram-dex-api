import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from './Asset';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';

@ObjectType()
export class AssetManyOutput {
  @Field(() => [Asset])
  assets: Asset[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
