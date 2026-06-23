import { Module } from '@nestjs/common';
import { DashboardBuilderService } from './dashboard-builder.service';
import { DashboardBuilderController } from './dashboard-builder.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [DashboardBuilderController], providers: [DashboardBuilderService], exports: [DashboardBuilderService] })
export class DashboardBuilderModule {}
