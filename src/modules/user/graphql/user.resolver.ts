import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UserService } from '../user.service';
import { UpdateOneUserArgs } from './args/UpdateOneUserArgs';
import { UniqueArgs } from 'src/common/graphql/args/UniqueArgs';
import { User } from './outputs/User';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { UserManyOutput } from './outputs/UserManyOutput';
import { UpdateOneUserRoleArgs } from './args/UpdateOneUserRoleArgs';
import { RoleGuard } from 'src/modules/auth/guard/RoleGuard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/modules/auth/utils/RolesDecorator';
import { UserRole } from '@prisma/client';
import { JwtGuard } from 'src/modules/auth/guard/JwtGuard';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => User)
  async deleteOneUser(@Args() args: UniqueArgs): Promise<User> {
    return this.userService.delete(args.id);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => User)
  async updateOneUser(@Args() args: UpdateOneUserArgs): Promise<User> {
    return this.userService.update(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.SuperAdmin)
  @Mutation(() => User)
  async updateOneUserRole(@Args() args: UpdateOneUserRoleArgs): Promise<User> {
    return this.userService.update(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => UserManyOutput)
  async findManyUsers(
    @Args({ nullable: true }) args?: FindManyArgs,
  ): Promise<UserManyOutput> {
    return this.userService.findMany(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => User, { nullable: true })
  async findOneUserById(@Args() args: UniqueArgs): Promise<User> {
    return this.userService.findOneById(args.id);
  }
}
