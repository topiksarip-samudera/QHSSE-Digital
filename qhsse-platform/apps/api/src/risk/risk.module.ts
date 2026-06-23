import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { RiskReportController } from './risk-report.controller';
import { RiskHazardController } from './risk-hazard.controller';
import { RiskMatrixController } from './risk-matrix.controller';
import { HiradcService } from './hiradc.service';
import { HiradcController } from './hiradc.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [RiskController, RiskReportController, RiskHazardController, RiskMatrixController, HiradcController], providers: [RiskService, HiradcService], exports: [RiskService, HiradcService] })
export class RiskModule {}
