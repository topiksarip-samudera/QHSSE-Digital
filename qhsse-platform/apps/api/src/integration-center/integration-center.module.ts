import { Module } from '@nestjs/common';
import { IntegrationCenterService } from './integration-center.service';
import { IntegrationCenterController } from './integration-center.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [IntegrationCenterController], providers: [IntegrationCenterService] })
export class IntegrationCenterModule {}
