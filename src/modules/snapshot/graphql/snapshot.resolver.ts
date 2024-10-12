import { Resolver, Query, Args } from '@nestjs/graphql';
import { SnapshotService } from '../snapshot.service';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { SnapshotChainManyOutput } from './outputs/SnapshotChainManyOutput';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guard/RoleGuard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/modules/auth/utils/RolesDecorator';

@Resolver()
export class SnapshotResolver {
  constructor(private snapshotService: SnapshotService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => SnapshotChainManyOutput)
  async findManySnapshotChains(
    @Args() args?: FindManyArgs,
  ): Promise<SnapshotChainManyOutput> {
    return await this.snapshotService.findManyChains(args);
  }
}
