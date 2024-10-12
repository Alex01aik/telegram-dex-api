import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitUserService implements OnModuleInit {
  private readonly logger = new Logger(InitUserService.name);
  private superAdminData = {
    id: '00000000-0000-0000-0000-000000000000',
    login: 'admin@admin.com',
    name: 'admin',
    password: 'admin',
  };

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    try {
      const isExistSuperAdmin = await this.prisma.user.findUnique({
        where: {
          id: this.superAdminData.id,
        },
      });
      if (!isExistSuperAdmin) {
        const hashedPassword = await bcrypt.hash(
          this.superAdminData.password,
          10,
        );
        await this.prisma.user.create({
          data: {
            id: this.superAdminData.id,
            login: this.superAdminData.login,
            name: this.superAdminData.name,
            hash: hashedPassword,
            role: UserRole.SuperAdmin,
          },
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
