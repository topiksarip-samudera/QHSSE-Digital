import { Module } from '@nestjs/common';
import { OfflineSyncService } from './offline-sync.service';
import { OfflineSyncController } from './offline-sync.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [OfflineSyncController], providers: [OfflineSyncService] })
export class OfflineSyncModule {}
