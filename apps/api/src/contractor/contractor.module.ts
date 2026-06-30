import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import {
  ContractorProfileController,
  ContractorPrequalificationController,
  ContractorDocumentController,
  ContractorWorkerController,
  ContractorEquipmentController,
  ContractorAuditInspectionController,
  ContractorIncidentController,
  ContractorSuspensionController,
  ContractorWatchlistController,
  ContractorPerformanceController,
  ContractorLinkController,
} from './contractor-crud.controller';
import { ContractorDashboardController } from './contractor-dashboard.controller';
import { ContractorDashboardService } from './contractor-dashboard.service';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { ContractorCorrectiveActionController } from './corrective-action.controller';
import { ContractorCorrectiveActionService } from './corrective-action.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    ContractorController,
    ContractorProfileController,
    ContractorPrequalificationController,
    ContractorDocumentController,
    ContractorWorkerController,
    ContractorEquipmentController,
    ContractorAuditInspectionController,
    ContractorIncidentController,
    ContractorSuspensionController,
    ContractorWatchlistController,
    ContractorPerformanceController,
    ContractorLinkController,
    ContractorDashboardController,
    BlacklistController,
    ContractorCorrectiveActionController,
  ],
  providers: [ContractorService, ContractorDashboardService, BlacklistService, ContractorCorrectiveActionService],
  exports: [ContractorService],
})
export class ContractorModule {}
