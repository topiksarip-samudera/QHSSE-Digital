import { Module } from '@nestjs/common';
import { AiGovernanceService } from './ai-governance.service';
import { AiGovernanceController } from './ai-governance.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [AiGovernanceController], providers: [AiGovernanceService] })
export class AiGovernanceModule {}
