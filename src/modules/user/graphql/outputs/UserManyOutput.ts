import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User';
import { FindManyMeta } from 'src/common/graphql/output/FindManyMeta';

@ObjectType()
export class UserManyOutput {
  @Field(() => [User])
  users: User[];

  @Field(() => FindManyMeta)
  meta: FindManyMeta;
}
