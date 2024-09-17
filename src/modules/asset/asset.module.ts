import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AssetService } from './asset.service';
import { AssetResolver } from './graphql/asset.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AssetResolver, AssetService],
})
export class AssetModule {}
