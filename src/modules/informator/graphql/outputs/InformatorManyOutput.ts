import { Field, ObjectType } from '@nestjs/graphql';
import { Informator } from './Informator';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';

@ObjectType()
export class InformatorManyOutput {
  @Field(() => [Informator])
  informators: Informator[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
