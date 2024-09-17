import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TelegramClient, Api } from 'telegram';
import bigInt from 'big-integer';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private telegramClient: TelegramClient,
    @Inject() private readonly chatService: ChatService,
  ) {}

  async onModuleInit() {
    this.telegramClient.addEventHandler(this.handleUpdate.bind(this));
  }

  createCorrectId(id: any, channel: boolean): string {
    let modifiedChannelId = String(id);
    if (modifiedChannelId.endsWith('n')) {
      modifiedChannelId = modifiedChannelId.slice(0, -1);
    }
    if (modifiedChannelId.startsWith('-100')) {
      return modifiedChannelId;
    }
    return channel ? '-100' + modifiedChannelId : modifiedChannelId;
  }

  private async handleUpdate(event: any) {
    if (event instanceof Api.UpdateShortChatMessage) {
      if (process.env.CHAT_ID === String(event.chatId)) {
        this.logger.log(`Handle informator message: ${event.message}`);
        try {
          const user = await this.getUserFromChat(event.chatId, event.fromId);

          if (user && !(user as any)?.bot) {
            await this.chatService.handleInformatorMessage({
              informator: {
                telegramId: String((user as any).id),
                username: (user as any).username,
              },
              message: event.message,
            });
          }
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  private async getUserFromChat(
    chatId: bigInt.BigInteger,
    userId: bigInt.BigInteger,
  ) {
    try {
      const users = await this.getGroupParticipants(chatId);
      const user = users.find((u) => userId.equals(u.id));
      return user;
    } catch (error) {
      this.logger.error(`Error getUserFromChat ${error}`);
    }
  }

  async getGroupParticipants(
    chatId: bigInt.BigInteger,
  ): Promise<Api.TypeUser[]> {
    try {
      const group = await this.telegramClient.invoke(
        new Api.messages.GetFullChat({
          chatId,
        }),
      );
      return group.users;
    } catch (error) {
      this.logger.error(`Error getGroupParticipants ${error}`);
      throw error;
    }
  }
}
