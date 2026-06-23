import { Module } from '@nestjs/common';
import { DocumentControlService } from './document-control.service';
import { DocumentControlController } from './document-control.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [DocumentControlController], providers: [DocumentControlService], exports: [DocumentControlService] })
export class DocumentControlModule {}
