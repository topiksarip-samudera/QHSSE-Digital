import { Module } from '@nestjs/common';
import { CalendarScheduleService } from './calendar-schedule.service';
import { CalendarScheduleController } from './calendar-schedule.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [CalendarScheduleController], providers: [CalendarScheduleService], exports: [CalendarScheduleService] })
export class CalendarScheduleModule {}
