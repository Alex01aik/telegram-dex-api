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

@Resolver()
export class InformatorResolver {
  constructor(private informatorService: InformatorService) {}

  @Mutation(() => Informator)
  async createOneInformator(
    @Args() args: CreateOneInformatorArgs,
  ): Promise<Informator> {
    return this.informatorService.create(args);
  }

  @Mutation(() => SuccessOutput)
  async deleteOneInformator(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    await this.informatorService.delete(args.id);
    return { success: true };
  }

  @Mutation(() => SuccessOutput)
  async updateOneInformator(
    @Args() args: UpdateOneInformatorArgs,
  ): Promise<SuccessOutput> {
    await this.informatorService.update(args);
    return { success: true };
  }

  @Query(() => InformatorManyOutput)
  async findManyInformators(
    @Args({ nullable: true }) args?: FindManyArgs,
  ): Promise<InformatorManyOutput> {
    return this.informatorService.findMany(args);
  }

  @Query(() => Informator, { nullable: true })
  async findOneInformatorById(@Args() args: UniqueArgs): Promise<Informator> {
    return this.informatorService.findById(args.id);
  }

  @Query(() => Informator, { nullable: true })
  async findOneInformatorByUsername(
    @Args() args: FindByUsernameArgs,
  ): Promise<Informator> {
    return this.informatorService.findByUserName(args.userName);
  }

  @Query(() => Informator, { nullable: true })
  async findOneInformatorByTelegramId(
    @Args() args: FindByTelegramIdArgs,
  ): Promise<Informator> {
    return this.informatorService.findByTelegramId(args.telegramId);
  }
}
