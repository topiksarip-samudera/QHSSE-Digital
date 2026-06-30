import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DashboardsService } from './dashboards.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService, DashboardsService],
  exports: [ReportsService, DashboardsService],
})
export class ReportsModule {}
