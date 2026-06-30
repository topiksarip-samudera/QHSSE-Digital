import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaasDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalTenants, activeSubscriptions, trialSubscriptions, cancelledSubscriptions, totalPlans, totalRevenue, recentInvoices] = await Promise.all([
      this.prisma.company.count({ where: { status: 'active' } }),
      this.prisma.subscription.count({ where: { status: 'active' } }),
      this.prisma.subscription.count({ where: { status: 'trial' } }),
      this.prisma.subscription.count({ where: { status: 'cancelled' } }),
      this.prisma.plan.count({ where: { isActive: true } }),
      this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
      this.prisma.invoice.findMany({ where: { status: 'paid' }, orderBy: { paidAt: 'desc' }, take: 10, include: { plan: { select: { name: true } } } }),
    ]);
    return { totalTenants, activeSubscriptions, trialSubscriptions, cancelledSubscriptions, totalPlans, totalRevenue: totalRevenue._sum?.amount || 0, recentInvoices };
  }
}
