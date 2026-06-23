import { Module } from '@nestjs/common';
import { ActionTrackingService } from './action-tracking.service';
import { ActionTrackingController } from './action-tracking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActionTrackingController],
  providers: [ActionTrackingService],
  exports: [ActionTrackingService],
})
export class ActionTrackingModule {}
