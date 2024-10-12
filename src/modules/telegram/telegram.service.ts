import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { TelegramClient, Api } from 'telegram';
import * as bigInt from 'big-integer';
import { ChatService } from '../chat/chat.service';
import {
  isBitcoinAddress,
  isEthereumAddress,
  isLitecoinAddress,
  isRippleAddress,
  isSolanaAddress,
  isTronAddress,
} from 'src/common/utils/addressValidator';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private telegramClient: TelegramClient,
    private readonly chatService: ChatService,
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
    const chatIds = await this.chatService.findAllChatIds();
    if (event instanceof Api.UpdateShortChatMessage) {
      if (chatIds.includes(String(event.chatId))) {
        try {
          this.validateMessage(event.message);
          const user = await this.getUserFromChat(event.chatId, event.fromId);
          if (user && !(user as any)?.bot) {
            await this.chatService.handleInformatorMessage({
              informator: {
                telegramId: String((user as any).id),
                username: (user as any).username,
              },
              chat: {
                telegramId: String(event.chatId),
              },
              message: event.message,
            });
          }
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
    if (event instanceof Api.UpdateNewChannelMessage) {
      const channelId = (event.message?.peerId as any)?.channelId;

      if (chatIds.includes(String(channelId))) {
        const channel = await this.getChannelInfoByChannelId(channelId);
        const message = (event.message as any)?.message;
        try {
          this.validateMessage(message);
          await this.chatService.handleInformatorMessage({
            informator: {
              telegramId: channelId,
              username: `Channel "${channel.title}"`,
            },
            chat: {
              telegramId: channelId,
            },
            message,
          });
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
      this.logger.error(`Error getUserFromChat: ${error}`);
    }
  }

  private async getGroupParticipants(
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
      this.logger.error(`Error getGroupParticipants: ${error}`);
      throw error;
    }
  }

  async getChannelInfoByChannelId(
    channelId: bigInt.BigInteger,
  ): Promise<Api.Channel> {
    try {
      const result = await this.telegramClient.invoke(
        new Api.channels.GetChannels({
          id: [
            new Api.InputChannel({
              channelId,
              accessHash: bigInt(0),
            }),
          ],
        }),
      );

      const channel = result.chats.find(
        (chat) => chat.id.equals(channelId) && chat instanceof Api.Channel,
      ) as Api.Channel;

      return channel;
    } catch (error) {
      this.logger.error(`Error getChannelInfo: ${error}`);
      throw error;
    }
  }

  async getChatInfoByChatId(chatId: bigInt.BigInteger): Promise<Api.Chat> {
    try {
      const result = await this.telegramClient.invoke(
        new Api.messages.GetFullChat(
          new Api.messages.GetFullChat({
            chatId,
          }),
        ),
      );

      const chat = result.chats.find(
        (chat) => chat.id.equals(chatId) && chat instanceof Api.Chat,
      ) as Api.Chat;

      return chat;
    } catch (error) {
      this.logger.error(`Error getChatInfo: ${error}`);
      throw error;
    }
  }

  validateMessage(message: string) {
    if (message.includes(' ')) {
      throw new BadRequestException(
        `${message} - message is not contract address`,
      );
    }
    if (
      !(
        isBitcoinAddress(message) ||
        isEthereumAddress(message) ||
        isLitecoinAddress(message) ||
        isRippleAddress(message) ||
        isSolanaAddress(message) ||
        isTronAddress(message)
      )
    ) {
      throw new BadRequestException(`${message} - unknown contract address`);
    }
  }
}
