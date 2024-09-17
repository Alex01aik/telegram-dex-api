import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatService } from './chat.service';
import { TaskService } from '../task/task';
import { TradeModule } from '../trade/trade.module';
import { DexModule } from '../dex/dex.module';
import { InformatorModule } from '../informator/informator.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    TradeModule,
    DexModule,
    InformatorModule,
    SnapshotModule,
    UserModule,
  ],
  providers: [ChatService, TaskService],
  exports: [ChatService],
})
export class ChatModule {}
