import { Module } from '@nestjs/common';
import { BackupRestoreService } from './backup-restore.service';
import { BackupRestoreController } from './backup-restore.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [BackupRestoreController], providers: [BackupRestoreService], exports: [BackupRestoreService] })
export class BackupRestoreModule {}
