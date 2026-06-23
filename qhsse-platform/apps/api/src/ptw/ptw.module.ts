import { Module } from '@nestjs/common';
import { PtwService } from './ptw.service';
import { PtwController } from './ptw.controller';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [PtwController, PermitController], providers: [PtwService, PermitService], exports: [PtwService, PermitService] })
export class PtwModule {}
