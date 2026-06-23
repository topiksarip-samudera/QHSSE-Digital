import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { IncidentReportController } from './incident-report.controller';
import { IncidentClassificationController } from './incident-classification.controller';
import { IncidentPeopleController } from './incident-people.controller';
import { IncidentReviewController } from './incident-review.controller';
import { IncidentInvestigationController } from './incident-investigation.controller';
import { IncidentRcaController } from './incident-rca.controller';
import { IncidentCapaController } from './incident-capa.controller';
import { IncidentTimelineController } from './incident-timeline.controller';
import { IncidentLessonsController } from './incident-lessons.controller';
import { IncidentDashboardController } from './incident-dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [IncidentController, IncidentReportController, IncidentClassificationController, IncidentPeopleController, IncidentReviewController, IncidentInvestigationController, IncidentRcaController, IncidentCapaController, IncidentTimelineController, IncidentLessonsController, IncidentDashboardController], providers: [IncidentService], exports: [IncidentService] })
export class IncidentModule {}
