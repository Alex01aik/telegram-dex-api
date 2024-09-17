import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SnapshotService } from './snapshot.service';
import { SnapshotResolver } from './graphql/snapshot.resolver';
import { AssetService } from '../asset/asset.service';

@Module({
  imports: [PrismaModule],
  providers: [SnapshotResolver, SnapshotService, AssetService],
  exports: [SnapshotService],
})
export class SnapshotModule {}
