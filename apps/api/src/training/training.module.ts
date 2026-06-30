import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { TrainingMatrixService } from './training-matrix.service';
import { TrainingMatrixController } from './training-matrix.controller';
import { CompetencyService } from './competency.service';
import { CompetencyController } from './competency.controller';
import { TrainingNeedService } from './training-need.service';
import { TrainingNeedController } from './training-need.controller';
import { TrainingDashboardService } from './dashboard.service';
import { TrainingDashboardController } from './dashboard.controller';
import { TrainingReportService } from './report.service';
import { TrainingReportController } from './report.controller';
import { GapAnalysisService } from './gap-analysis.service';
import { GapAnalysisController } from './gap-analysis.controller';
import { CertificateDashboardService } from './certificate.service';
import { CertificateExtraController } from './certificate.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainingController, TrainingMatrixController, CompetencyController, TrainingNeedController, TrainingDashboardController, TrainingReportController, GapAnalysisController, CertificateExtraController],
  providers: [TrainingService, TrainingMatrixService, CompetencyService, TrainingNeedService, TrainingDashboardService, TrainingReportService, GapAnalysisService, CertificateDashboardService],
  exports: [TrainingService, TrainingMatrixService, CompetencyService, TrainingNeedService, TrainingDashboardService, TrainingReportService, GapAnalysisService, CertificateDashboardService],
})
export class TrainingModule {}
