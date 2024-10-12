import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TransactionRuleService } from './transaction-rule.service';
import { InitTransactionRuleService } from './init.transaction-rule.service';
import { TransactionRuleResolver } from './graphql/transaction-rule.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    TransactionRuleService,
    InitTransactionRuleService,
    TransactionRuleResolver,
  ],
  exports: [TransactionRuleService],
})
export class TransactionRuleModule {}
