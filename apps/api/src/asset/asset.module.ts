import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import {
  AssetRegisterController, AssetCategoryController, AssetMaintenanceController,
  AssetScheduleController, AssetInspectionController, AssetCertificateController,
  AssetTransferController, AssetDisposalController, AssetLinkController,
} from './asset-crud.controller';
import { AssetCalibrationController } from './asset-calibration.controller';
import { AssetCalibrationService } from './asset-calibration.service';
import { AssetLotoController } from './asset-loto.controller';
import { AssetLotoService } from './asset-loto.service';
import { AssetIsolationController } from './asset-isolation.controller';
import { AssetIsolationService } from './asset-isolation.service';
import { AssetStatusController, AssetOverviewController } from './asset-status.controller';
import { AssetCertificateExtraController } from './asset-certificate-extra.controller';
import { AssetInspectionExtraController } from './asset-inspection-extra.controller';
import { AssetQrController } from './asset-qr.controller';
import { AssetReportController } from './asset-report.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AssetController, AssetRegisterController, AssetCategoryController,
    AssetMaintenanceController, AssetScheduleController, AssetInspectionController,
    AssetCertificateController, AssetTransferController, AssetDisposalController,
    AssetLinkController,
    AssetCalibrationController, AssetLotoController, AssetIsolationController,
    AssetStatusController, AssetOverviewController, AssetCertificateExtraController,
    AssetInspectionExtraController, AssetQrController, AssetReportController,
  ],
  providers: [AssetService, AssetCalibrationService, AssetLotoService, AssetIsolationService],
  exports: [AssetService, AssetCalibrationService, AssetLotoService, AssetIsolationService],
})
export class AssetModule {}
