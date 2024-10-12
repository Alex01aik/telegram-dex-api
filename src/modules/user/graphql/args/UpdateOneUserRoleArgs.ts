import { Field, ArgsType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsUUID } from 'class-validator';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ArgsType()
export class UpdateOneUserRoleArgs {
  @IsUUID()
  @Field()
  id: string;

  @Field(() => UserRole)
  role: UserRole;
}
