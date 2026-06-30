import { Module } from '@nestjs/common';
import { QualityService } from './quality.service';
import { QualityInspectionService } from './quality-inspection.service';
import { QualityCapaService } from './quality-capa.service';
import { QualityLinkService } from './quality-link.service';
import { QualityRcaService } from './quality-rca.service';
import { QualityEffectivenessService } from './quality-effectiveness.service';
import { QualityCopqService } from './quality-copq.service';
import { QualityController } from './quality.controller';
import { QualityNcrController, QualityComplaintController, QualitySupplierController, QualityDispositionController } from './quality-crud.controller';
import { QualityMaterialController, QualityItpController, QualityInspectionResultController, QualityPunchListController, QualityDefectController } from './quality-inspection.controller';
import { QualityCapaController, QualityCalibrationController, QualityLinkController } from './quality-capa.controller';
import { QualityRcaController } from './quality-rca.controller';
import { QualityEffectivenessController } from './quality-effectiveness.controller';
import { QualityCopqController } from './quality-copq.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    QualityController, QualityNcrController, QualityComplaintController,
    QualitySupplierController, QualityDispositionController,
    QualityMaterialController, QualityItpController, QualityInspectionResultController,
    QualityPunchListController, QualityDefectController,
    QualityCapaController, QualityCalibrationController, QualityLinkController,
    QualityRcaController, QualityEffectivenessController, QualityCopqController,
  ],
  providers: [QualityService, QualityInspectionService, QualityCapaService, QualityLinkService, QualityRcaService, QualityEffectivenessService, QualityCopqService],
  exports: [QualityService, QualityCapaService, QualityRcaService, QualityEffectivenessService, QualityCopqService],
})
export class QualityModule {}
