import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { BillingController } from './billing.controller';
import { SaasDashboardController } from './saas-dashboard.controller';
import { SaasDashboardService } from './saas-dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [SubscriptionController, BillingController, SaasDashboardController], providers: [SubscriptionService, SaasDashboardService], exports: [SubscriptionService, SaasDashboardService] })
export class SubscriptionModule {}
