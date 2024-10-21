import { Field, ArgsType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsUUID } from 'class-validator';

@ArgsType()
export class UpdateMyUserArgs {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isAutoTrade?: boolean;
}

@ArgsType()
export class UpdateOneUserArgs {
  @IsUUID()
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isAutoTrade?: boolean;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
