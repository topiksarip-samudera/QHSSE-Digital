import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SitesController, DepartmentsController, LocationsController, PositionsController],
  providers: [SitesService, DepartmentsService, LocationsService, PositionsService],
  exports: [SitesService, DepartmentsService, LocationsService, PositionsService],
})
export class OrganizationModule {}
