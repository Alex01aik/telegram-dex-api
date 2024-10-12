import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InformatorService } from '../informator/informator.service';
import { TaskService } from '../task/task.service';
import { PrismaService } from 'prisma/prisma.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { CreateOneChatArgs } from './graphql/args/CreateOneArgs';
import { TelegramService } from '../telegram/telegram.service';
import * as bigInt from 'big-integer';

type HandleInformatorMessage = {
  informator: {
    username: string;
    telegramId: string;
  };
  chat: {
    telegramId: string;
  };
  message: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly informatorService: InformatorService,
    private readonly taskService: TaskService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {}

  async handleInformatorMessage(args: HandleInformatorMessage) {
    let informator = await this.informatorService.findByTelegramId(
      args.informator.telegramId,
    );
    if (!informator) {
      informator = await this.informatorService.create({
        telegramId: args.informator.telegramId,
        userName: args.informator.username,
      });
    }

    await this.taskService.processSnapshotChain(
      args.message,
      informator,
      args.chat.telegramId,
    );
  }

  async upsertOne(args: {
    chatName: string;
    telegramId: string;
    infornatorId: string;
  }) {
    await this.prisma.chat.upsert({
      where: {
        telegramId: args.telegramId,
      },
      create: {
        name: args.chatName,
        telegramId: args.telegramId,
        informators: {
          connect: {
            id: args.infornatorId,
          },
        },
        rate: {
          create: {},
        },
      },
      update: {
        informators: {
          connect: {
            id: args.infornatorId,
          },
        },
      },
    });
  }

  async findMany(args?: FindManyArgs) {
    const chats = await this.prisma.chat.findMany({
      ...args,
      include: {
        informators: true,
        rate: true,
      },
    });
    const total = await this.prisma.chat.count();
    return { chats, meta: { total } };
  }

  async findAllChatIds(args?: FindManyArgs) {
    const chats = await this.prisma.chat.findMany({
      ...args,
    });

    return chats.map((chat) => chat.telegramId);
  }

  async deleteOne(id: string) {
    return this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }

  async createOne(args: CreateOneChatArgs) {
    let name = '';
    try {
      const chat = await this.telegramService.getChatInfoByChatId(
        bigInt(args.telegramId),
      );
      name = chat.title;
    } catch (error) {
      try {
        const channel = await this.telegramService.getChannelInfoByChannelId(
          bigInt(args.telegramId),
        );
        name = channel.title;
      } catch (error) {
        throw new BadGatewayException('Unknown chat');
      }
    }
    return this.prisma.chat.create({
      data: {
        telegramId: args.telegramId,
        name,
        rate: {
          create: {
            fales: 0,
            successes: 0,
          },
        },
      },
      include: {
        rate: true,
        informators: true,
      },
    });
  }
}
