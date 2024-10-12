import { Field, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
// import { GraphQLDecimal } from 'graphql-type-decimal';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Snapshot {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  price?: Decimal;

  @Field(() => String, { nullable: true })
  liquidity?: Decimal;

  @Field(() => GraphQLJSON, { nullable: true })
  payload?: Prisma.JsonValue;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
