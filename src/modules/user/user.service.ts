import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOneUserArgs } from './graphql/args/UpdateOneUserArgs';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { UpdateOneUserRoleArgs } from './graphql/args/UpdateOneUserRoleArgs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByLogin(login: string) {
    return await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
  }

  async findMany(args?: FindManyArgs) {
    const users = await this.prisma.user.findMany({
      ...args,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.user.count();
    return { users, meta: { total } };
  }

  async findManyAutoTrade() {
    return await this.prisma.user.findMany({
      where: {
        isAutoTrade: true,
      },
    });
  }

  async create(data: Pick<User, 'name' | 'login' | 'hash'>) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        login: data.login,
      },
    });
    if (isExist) {
      throw new BadRequestException('User already existed');
    }

    return await this.prisma.user.create({
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(data: UpdateOneUserArgs | UpdateOneUserRoleArgs) {
    return await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
