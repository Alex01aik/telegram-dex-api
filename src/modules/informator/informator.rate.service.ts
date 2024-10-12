import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InformatorRateService {
  constructor(private readonly prisma: PrismaService) {}

  async riseInformatorFales(id: string) {
    await this.prisma.informator.update({
      where: {
        id,
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

  async riseInformatorSuccesses(id: string) {
    await this.prisma.informator.update({
      where: {
        id,
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
