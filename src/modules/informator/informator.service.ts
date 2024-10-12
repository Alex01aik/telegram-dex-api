import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOneInformatorArgs } from './graphql/args/CreateOneInformatorArgs';
import { UpdateOneInformatorArgs } from './graphql/args/UpdateOneInformatorArgs';
import { PrismaService } from 'prisma/prisma.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';

@Injectable()
export class InformatorService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.informator.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserName(userName: string) {
    return await this.prisma.informator.findUnique({
      where: {
        userName,
      },
    });
  }

  async findByTelegramId(telegramId: string) {
    return await this.prisma.informator.findUnique({
      where: {
        telegramId,
      },
    });
  }

  async findMany(args?: FindManyArgs) {
    const informators = await this.prisma.informator.findMany({
      ...args,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        rate: true,
      },
    });
    const total = await this.prisma.informator.count();
    return { informators, meta: { total } };
  }

  async create(data: CreateOneInformatorArgs) {
    const isExist = await this.prisma.informator.findUnique({
      where: {
        userName: data.userName,
      },
    });
    if (isExist) {
      throw new BadRequestException('Informator already existed');
    }

    return await this.prisma.informator.create({
      data: {
        ...data,
        rate: {
          create: {
            successes: 0,
            fales: 0,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.informator.delete({
      where: {
        id,
      },
    });
  }

  async update(data: UpdateOneInformatorArgs) {
    return await this.prisma.informator.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
