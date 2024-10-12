import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UpdateOneInformatorArgs } from './args/UpdateOneInformatorArgs';
import { UniqueArgs } from 'src/common/graphql/args/UniqueArgs';
import { SuccessOutput } from 'src/common/graphql/output/SuccessOutput';
import { CreateOneInformatorArgs } from './args/CreateOneInformatorArgs';
import { InformatorService } from '../informator.service';
import { Informator } from './outputs/Informator';
import { FindByUsernameArgs } from './args/FindByUsernameArgs';
import { FindByTelegramIdArgs } from './args/FindByTelegramIdArgs';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { InformatorManyOutput } from './outputs/InformatorManyOutput';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guard/RoleGuard';
import { Roles } from 'src/modules/auth/utils/RolesDecorator';
import { UserRole } from '@prisma/client';

@Resolver()
export class InformatorResolver {
  constructor(private informatorService: InformatorService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => Informator)
  async createOneInformator(
    @Args() args: CreateOneInformatorArgs,
  ): Promise<Informator> {
    return this.informatorService.create(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => Informator)
  async deleteOneInformator(@Args() args: UniqueArgs): Promise<Informator> {
    return this.informatorService.delete(args.id);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => Informator)
  async updateOneInformator(
    @Args() args: UpdateOneInformatorArgs,
  ): Promise<Informator> {
    return this.informatorService.update(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => InformatorManyOutput)
  async findManyInformators(
    @Args({ nullable: true }) args?: FindManyArgs,
  ): Promise<InformatorManyOutput> {
    return this.informatorService.findMany(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => Informator, { nullable: true })
  async findOneInformatorById(@Args() args: UniqueArgs): Promise<Informator> {
    return this.informatorService.findById(args.id);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => Informator, { nullable: true })
  async findOneInformatorByUsername(
    @Args() args: FindByUsernameArgs,
  ): Promise<Informator> {
    return this.informatorService.findByUserName(args.userName);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => Informator, { nullable: true })
  async findOneInformatorByTelegramId(
    @Args() args: FindByTelegramIdArgs,
  ): Promise<Informator> {
    return this.informatorService.findByTelegramId(args.telegramId);
  }
}
