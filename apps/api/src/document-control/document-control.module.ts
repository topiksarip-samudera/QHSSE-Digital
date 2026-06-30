import { Module } from '@nestjs/common';
import { DocumentControlService } from './document-control.service';
import { DocumentControlController } from './document-control.controller';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [DocumentControlController, DocumentController], providers: [DocumentControlService, DocumentService], exports: [DocumentControlService, DocumentService] })
export class DocumentControlModule {}
