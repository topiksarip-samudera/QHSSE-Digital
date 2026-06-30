import { Module } from '@nestjs/common';
import { LegalService } from './legal.service';
import { LegalAssessmentService } from './legal-assessment.service';
import { LegalUpdateService } from './legal-update.service';
import { LegalLinkService } from './legal-link.service';
import { LegalStandardService } from './legal-standard.service';
import { LegalRequirementService } from './legal-requirement.service';
import { LegalApplicabilityService } from './legal-applicability.service';
import { LegalDashboardService } from './legal-dashboard.service';
import { LegalReportService } from './legal-report.service';
import { LegalController } from './legal.controller';
import { LegalRegulationController, LegalObligationController, LegalEvidenceController } from './legal-crud.controller';
import { LegalAssessmentController, LegalGapController } from './legal-assessment.controller';
import { LegalUpdateController, LegalLinkController } from './legal-update.controller';
import { LegalStandardController } from './legal-standard.controller';
import { LegalRequirementController } from './legal-requirement.controller';
import { LegalApplicabilityController } from './legal-applicability.controller';
import { LegalDashboardController } from './legal-dashboard.controller';
import { LegalReportController } from './legal-report.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [LegalController, LegalRegulationController, LegalObligationController, LegalEvidenceController, LegalAssessmentController, LegalGapController, LegalUpdateController, LegalLinkController, LegalStandardController, LegalRequirementController, LegalApplicabilityController, LegalDashboardController, LegalReportController], providers: [LegalService, LegalAssessmentService, LegalUpdateService, LegalLinkService, LegalStandardService, LegalRequirementService, LegalApplicabilityService, LegalDashboardService, LegalReportService], exports: [LegalService, LegalAssessmentService, LegalStandardService, LegalRequirementService, LegalApplicabilityService, LegalDashboardService, LegalReportService] })
export class LegalModule {}
