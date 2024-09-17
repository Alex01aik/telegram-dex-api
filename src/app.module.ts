import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { InformatorModule } from './modules/informator/informator.module';
import { SnapshotModule } from './modules/snapshot/snapshot.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ChatModule } from './modules/chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetModule } from './modules/asset/asset.module';
import { TradeModule } from './modules/trade/trade.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      path: '/graphql',
    }),
    TelegramModule.forRoot(
      Number(process.env.API_ID),
      process.env.API_HASH,
      process.env.API_SESSION,
    ),
    UserModule,
    InformatorModule,
    AssetModule,
    SnapshotModule,
    ChatModule,
    TradeModule,
  ],
  providers: [],
})
export class AppModule {}
