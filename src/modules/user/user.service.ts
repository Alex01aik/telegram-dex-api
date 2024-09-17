import { Injectable } from '@nestjs/common';
import { CreateOneUserArgs } from './graphql/args/CreateOneUserArgs';
import { UpdateOneUserArgs } from './graphql/args/UpdateOneUserArgs';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findMany() {
    return await this.prisma.user.findMany();
  }

  async findManyAutoTrade() {
    return await this.prisma.user.findMany({
      where: {
        isAutoTrade: true,
      },
    });
  }

  async create(data: CreateOneUserArgs) {
    // TODO if (isExist) {
    //   throw new BadRequestException('User already existed');
    // }

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

  async update(data: UpdateOneUserArgs) {
    return await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
