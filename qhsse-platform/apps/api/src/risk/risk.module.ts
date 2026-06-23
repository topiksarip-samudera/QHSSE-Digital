import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { RiskReportController } from './risk-report.controller';
import { RiskHazardController } from './risk-hazard.controller';
import { RiskMatrixController } from './risk-matrix.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [RiskController, RiskReportController, RiskHazardController, RiskMatrixController], providers: [RiskService], exports: [RiskService] })
export class RiskModule {}
