import { Module } from '@nestjs/common';
import { DataRetentionService } from './data-retention.service';
import { DataRetentionController } from './data-retention.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [DataRetentionController], providers: [DataRetentionService] })
export class DataRetentionModule {}
