import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';

import { TransactionRuleService } from '../transaction-rule.service';
import { TransactionRuleManyOutput } from './outputs/TransactionRuleManyOutput';
import { CreateOneSellTransactionRuleArgs } from './args/CreateOneSellTransactionRule';
import { TransactionRule } from './outputs/TransactionRule';
import { TransactionRuleType, UserRole } from '@prisma/client';
import { UpdateOneTransactionRuleArgs } from './args/UpdateOneTransactionRule';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guard/RoleGuard';
import { Roles } from 'src/modules/auth/utils/RolesDecorator';

@Resolver()
export class TransactionRuleResolver {
  constructor(private transactionRuleService: TransactionRuleService) {}

  @Query(() => TransactionRuleManyOutput)
  async findManyTransactionRules(
    @Args() args: FindManyArgs,
  ): Promise<TransactionRuleManyOutput> {
    return this.transactionRuleService.findMany(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => TransactionRule)
  async createOneSellTransactionRule(
    @Args() args: CreateOneSellTransactionRuleArgs,
  ): Promise<TransactionRule> {
    return this.transactionRuleService.createOne({
      ...args,
      type: TransactionRuleType.SELL,
    });
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => TransactionRule)
  async updateOneTransactionRule(
    @Args() args: UpdateOneTransactionRuleArgs,
  ): Promise<TransactionRule> {
    return this.transactionRuleService.updateOne(args);
  }
}
