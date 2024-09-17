import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOneAssetArgs } from './graphql/args/CreateOneAssetArgs';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOneAssetArgs) {
    const isExist = await this.prisma.asset.findUnique({
      where: {
        address: data.address,
      },
    });
    if (isExist) {
      throw new BadRequestException('Asset already existed');
    }

    return this.prisma.asset.create({
      data,
    });
  }

  async findMany(args?: FindManyArgs) {
    const assets = await this.prisma.asset.findMany({
      ...args,
    });
    const total = await this.prisma.asset.count();
    return {
      assets,
      meta: { total },
    };
  }

  async findOneByName(name: string) {
    return this.prisma.asset.findUnique({
      where: {
        name,
      },
    });
  }

  async findOneByAddress(address: string) {
    return this.prisma.asset.findUnique({
      where: {
        address,
      },
    });
  }
}
