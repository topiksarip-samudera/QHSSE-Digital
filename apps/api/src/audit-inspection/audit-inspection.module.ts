import { Module } from '@nestjs/common';
import { AuditInspectionService } from './audit-inspection.service';
import { AuditInspectionController } from './audit-inspection.controller';
import { AuditService } from './audit.service';
import { AuditCrudController } from './audit-crud.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [AuditInspectionController, AuditCrudController], providers: [AuditInspectionService, AuditService], exports: [AuditInspectionService, AuditService] })
export class AuditInspectionModule {}
