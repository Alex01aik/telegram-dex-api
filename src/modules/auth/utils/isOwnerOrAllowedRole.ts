import { ForbiddenException } from '@nestjs/common/exceptions';
import { User } from '@prisma/client';

export const isOwnerOrAllowedRole = <UserRole>(
  objectUser: User,
  user: User,
  allowedRoles?: UserRole[],
) => {
  if (
    !(
      allowedRoles?.some((role) => role === user.role) ||
      objectUser.id === user.id
    )
  ) {
    throw new ForbiddenException();
  }
};
