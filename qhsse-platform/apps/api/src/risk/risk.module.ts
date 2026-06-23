import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { RiskReportController } from './risk-report.controller';
import { RiskHazardController } from './risk-hazard.controller';
import { RiskMatrixController } from './risk-matrix.controller';
import { HiradcService } from './hiradc.service';
import { HiradcController } from './hiradc.controller';
import { JsaService } from './jsa.service';
import { JsaController } from './jsa.controller';
import { RiskControlController } from './risk-control.controller';
import { RiskActionController } from './risk-action.controller';
import { RiskReviewController } from './risk-review.controller';
import { RiskLinkController } from './risk-link.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [RiskController, RiskReportController, RiskHazardController, RiskMatrixController, HiradcController, JsaController, RiskControlController, RiskActionController, RiskReviewController, RiskLinkController], providers: [RiskService, HiradcService, JsaService], exports: [RiskService, HiradcService, JsaService] })
export class RiskModule {}
