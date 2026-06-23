import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { RiskReportController } from './risk-report.controller';
import { RiskHazardController } from './risk-hazard.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [RiskController, RiskReportController, RiskHazardController], providers: [RiskService], exports: [RiskService] })
export class RiskModule {}
