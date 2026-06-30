import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import {
  SecurityIncidentController,
  SecurityVisitorController,
  SecurityGatePassController,
  SecurityBadgeController,
  SecurityAccessController,
  SecurityPatrolController,
  SecurityLostFoundController,
  SecurityInvestigationController,
  SecurityActionController,
  SecurityLinkController,
} from './security-crud.controller';
import { VehicleAccessController } from './vehicle-access.controller';
import { VehicleAccessService } from './vehicle-access.service';
import { PatrolRouteController } from './patrol-route.controller';
import { PatrolRouteService } from './patrol-route.service';
import { PatrolRunController } from './patrol-run.controller';
import { PatrolRunService } from './patrol-run.service';
import { SecurityDashboardService } from './security-dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    SecurityController,
    SecurityIncidentController,
    SecurityVisitorController,
    SecurityGatePassController,
    SecurityBadgeController,
    SecurityAccessController,
    SecurityPatrolController,
    SecurityLostFoundController,
    SecurityInvestigationController,
    SecurityActionController,
    SecurityLinkController,
    VehicleAccessController,
    PatrolRouteController,
    PatrolRunController,
  ],
  providers: [SecurityService, VehicleAccessService, PatrolRouteService, PatrolRunService, SecurityDashboardService],
  exports: [SecurityService, VehicleAccessService, PatrolRouteService, PatrolRunService, SecurityDashboardService],
})
export class SecurityModule {}
