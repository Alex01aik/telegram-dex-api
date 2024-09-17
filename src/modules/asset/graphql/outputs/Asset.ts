import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Asset {
  @Field()
  address: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
