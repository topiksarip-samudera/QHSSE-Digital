import { Module } from '@nestjs/common';
import { ModuleManagementService } from './module-management.service';
import { ModuleManagementController } from './module-management.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModuleManagementController],
  providers: [ModuleManagementService],
  exports: [ModuleManagementService],
})
export class ModuleManagementModule {}
