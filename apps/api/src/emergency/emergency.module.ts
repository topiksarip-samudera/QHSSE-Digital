import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import {
  EmergencyPlanController,
  EmergencyTeamController,
  EmergencyContactController,
  EmergencyDrillController,
  EmergencyEquipmentController,
  EmergencyIncidentController,
  EmergencyLinkController,
} from './emergency-crud.controller';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { MusterPointService } from './muster-point.service';
import { MusterPointController } from './muster-point.controller';
import { EvacuationRouteService } from './evacuation-route.service';
import { EvacuationRouteController } from './evacuation-route.controller';
import { FireEquipmentService } from './fire-equipment.service';
import { FireEquipmentController } from './fire-equipment.controller';
import { FindingService } from './finding.service';
import { FindingController } from './finding.controller';
import { CorrectiveActionService } from './corrective-action.service';
import { CorrectiveActionController } from './corrective-action.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    EmergencyController,
    EmergencyPlanController,
    EmergencyTeamController,
    EmergencyContactController,
    EmergencyDrillController,
    EmergencyEquipmentController,
    EmergencyIncidentController,
    EmergencyLinkController,
    ScenarioController,
    MusterPointController,
    EvacuationRouteController,
    FireEquipmentController,
    FindingController,
    CorrectiveActionController,
  ],
  providers: [
    EmergencyService,
    ScenarioService,
    MusterPointService,
    EvacuationRouteService,
    FireEquipmentService,
    FindingService,
    CorrectiveActionService,
  ],
  exports: [EmergencyService],
})
export class EmergencyModule {}
