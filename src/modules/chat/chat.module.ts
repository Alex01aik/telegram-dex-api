import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatService } from './chat.service';
import { TaskService } from '../task/task.service';
import { TradeModule } from '../trade/trade.module';
import { DexModule } from '../dex/dex.module';
import { InformatorModule } from '../informator/informator.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { UserModule } from '../user/user.module';
import { ChatResolver } from './chat.resolver';
import { TransactionRuleModule } from '../transaction-rule/transaction-rule.module';
import { ChatRateService } from './chat.rate.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  imports: [
    PrismaModule,
    TradeModule,
    DexModule,
    InformatorModule,
    SnapshotModule,
    UserModule,
    TransactionRuleModule,
  ],
  providers: [
    ChatService,
    ChatResolver,
    TaskService,
    ChatRateService,
    TelegramService,
  ],
  exports: [ChatService, ChatRateService],
})
export class ChatModule {}
