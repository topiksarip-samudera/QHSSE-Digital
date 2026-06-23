import { Module } from '@nestjs/common';
import { AdvancedPermissionService } from './advanced-permission.service';
import { AdvancedPermissionController } from './advanced-permission.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [AdvancedPermissionController], providers: [AdvancedPermissionService] })
export class AdvancedPermissionModule {}
