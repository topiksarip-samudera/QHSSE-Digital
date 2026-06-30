import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { EnvironmentController } from './environment.controller';
import { EnvironmentAspectService } from './aspect.service';
import { EnvironmentAspectController } from './aspect.controller';
import { EnvironmentPermitService } from './permit.service';
import { EnvironmentPermitController } from './permit.controller';
import { EnvironmentWasteService } from './waste.service';
import { EnvironmentWasteController } from './waste.controller';
import { EnvironmentMonitoringService } from './monitoring.service';
import { EnvironmentMonitoringController } from './monitoring.controller';
import { EnvironmentEnergyService } from './energy.service';
import { EnvironmentEnergyController } from './energy.controller';
import { EnvironmentKpiService } from './kpi.service';
import { EnvironmentKpiController } from './kpi.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnvironmentController, EnvironmentAspectController, EnvironmentPermitController, EnvironmentWasteController, EnvironmentMonitoringController, EnvironmentEnergyController, EnvironmentKpiController],
  providers: [EnvironmentService, EnvironmentAspectService, EnvironmentPermitService, EnvironmentWasteService, EnvironmentMonitoringService, EnvironmentEnergyService, EnvironmentKpiService],
  exports: [EnvironmentService, EnvironmentAspectService, EnvironmentPermitService, EnvironmentWasteService, EnvironmentMonitoringService, EnvironmentEnergyService, EnvironmentKpiService]
})
export class EnvironmentModule {}
