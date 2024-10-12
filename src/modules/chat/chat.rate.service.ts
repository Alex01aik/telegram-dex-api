import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatRateService {
  constructor(private readonly prisma: PrismaService) {}

  async riseChatFales(telegramId: string) {
    await this.prisma.chat.update({
      where: {
        telegramId,
      },
      data: {
        rate: {
          update: {
            fales: {
              increment: 1,
            },
          },
        },
      },
    });
  }

  async riseChatSuccesses(telegramId: string) {
    await this.prisma.chat.update({
      where: {
        telegramId,
      },
      data: {
        rate: {
          update: {
            successes: {
              increment: 1,
            },
          },
        },
      },
    });
  }
}
