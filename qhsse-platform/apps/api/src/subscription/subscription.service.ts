import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto, UpdateSubscriptionDto, PlanQueryDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  // Plans
  async createPlan(dto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data: { name: dto.name, description: dto.description, price: dto.price || 0, interval: dto.interval || 'monthly', maxUsers: dto.maxUsers, maxSites: dto.maxSites, maxStorage: dto.maxStorage, trialDays: dto.trialDays || 0 },
    });
    if (dto.features) {
      for (const f of dto.features) {
        await this.prisma.planFeature.create({ data: { planId: plan.id, code: f.code, name: f.name, value: f.value } });
      }
    }
    return this.getPlan(plan.id);
  }

  async getPlans(query: PlanQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.plan.findMany({ where: { isActive: true }, include: { features: true, _count: { select: { subscriptions: true } } }, orderBy: { sortOrder: 'asc' }, skip, take: limit }),
      this.prisma.plan.count({ where: { isActive: true } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getPlan(id: string) {
    const p = await this.prisma.plan.findUnique({ where: { id }, include: { features: true } });
    if (!p) throw new NotFoundException('Plan not found');
    return p;
  }

  async updatePlan(id: string, data: any) {
    return this.prisma.plan.update({ where: { id }, data });
  }

  async deletePlan(id: string) {
    await this.prisma.plan.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  // Subscriptions
  async getSubscription(companyId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { companyId }, include: { plan: { include: { features: true } }, usage: true } });
    if (!sub) throw new NotFoundException('No subscription found');
    return sub;
  }

  async updateSubscription(companyId: string, dto: UpdateSubscriptionDto) {
    const sub = await this.prisma.subscription.findUnique({ where: { companyId } });
    if (!sub) throw new NotFoundException('No subscription');

    if (dto.planId && dto.planId !== sub.planId) {
      await this.prisma.billingLog.create({ data: { companyId, action: 'plan_change', details: { from: sub.planId, to: dto.planId } } });
    }

    return this.prisma.subscription.update({ where: { companyId }, data: { planId: dto.planId || sub.planId, status: dto.status || sub.status }, include: { plan: { include: { features: true } }, usage: true } });
  }

  async getUsage(companyId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { companyId }, include: { usage: true, plan: true } });
    if (!sub) throw new NotFoundException('No subscription');
    return {
      plan: sub.plan.name,
      usage: sub.usage || { users: 0, sites: 0, storageMb: 0, apiCalls: 0, aiCalls: 0 },
      limits: {
        maxUsers: sub.plan.maxUsers || 'Unlimited',
        maxSites: sub.plan.maxSites || 'Unlimited',
        maxStorage: sub.plan.maxStorage ? `${sub.plan.maxStorage} GB` : 'Unlimited',
      },
      status: sub.status,
    };
  }

  // Invoices
  async getInvoices(companyId: string) {
    return this.prisma.invoice.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }
}
