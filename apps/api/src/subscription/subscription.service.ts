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

  async checkout(companyId: string, planId: string, userId: string, paymentMethod?: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    const invoice = await this.prisma.invoice.create({ data: { companyId, planId, amount: plan.price || 0, currency: plan.currency || 'USD', status: 'pending', description: `Subscription to ${plan.name}`, createdBy: userId } });
    return { invoiceId: invoice.id, planName: plan.name, amount: plan.price || 0, currency: plan.currency || 'USD', checkoutUrl: `/billing/checkout/${invoice.id}`, message: 'Checkout initiated. Complete payment to activate subscription.' };
  }

  async handleWebhook(gateway: string, payload: any) {
    const event = payload?.event || payload?.type;
    if (event === 'payment.succeeded') {
      const invoiceId = payload?.invoiceId || payload?.data?.object?.metadata?.invoiceId;
      if (invoiceId) {
        await this.prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'paid', paidAt: new Date() } });
        const inv = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
        if (inv?.planId && inv?.companyId) {
          await this.prisma.subscription.upsert({ where: { companyId: inv.companyId }, create: { companyId: inv.companyId, planId: inv.planId, status: 'active', startDate: new Date() }, update: { planId: inv.planId, status: 'active', startDate: new Date() } });
          await this.prisma.billingLog.create({ data: { companyId: inv.companyId, action: 'subscription_activated', detail: `Paid invoice ${inv.invoiceNumber || inv.id}`, createdBy: 'webhook' } });
        }
      }
      return { received: true, event: 'payment.succeeded', invoiceId };
    }
    if (event === 'payment.failed') {
      return { received: true, event: 'payment.failed' };
    }
    if (event === 'subscription.cancelled') {
      const companyId = payload?.companyId || payload?.data?.object?.metadata?.companyId;
      if (companyId) await this.prisma.subscription.update({ where: { companyId }, data: { status: 'cancelled' } });
      return { received: true, event: 'subscription.cancelled' };
    }
    return { received: true, event: event || 'unknown' };
  }

  async cancelSubscription(companyId: string) {
    await this.prisma.subscription.update({ where: { companyId }, data: { status: 'cancelled' } });
    await this.prisma.billingLog.create({ data: { companyId, action: 'subscription_cancelled', detail: 'Cancelled by user', createdBy: 'system' } });
    return { success: true, message: 'Subscription cancelled' };
  }

  async startTrial(companyId: string, planId: string, trialDays: number) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate() + trialDays);
    const sub = await this.prisma.subscription.upsert({ where: { companyId }, create: { companyId, planId, status: 'trial', startDate: new Date(), trialEndsAt: trialEnd, trialDays }, update: { planId, status: 'trial', startDate: new Date(), trialEndsAt: trialEnd, trialDays } });
    await this.prisma.billingLog.create({ data: { companyId, action: 'trial_started', detail: `Trial for ${plan?.name} (${trialDays} days)`, createdBy: 'system' } });
    return { subscription: sub, trialEndsAt: trialEnd, trialDays, message: `Trial started. Expires ${trialEnd.toISOString()}` };
  }

  async getSubscriptionStatus(companyId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { companyId }, include: { plan: true } });
    if (!sub) return { hasSubscription: false, subscribed: false };
    const isTrial = sub.status === 'trial';
    const trialExpired = isTrial && sub.trialEndsAt && new Date() > sub.trialEndsAt;
    return { hasSubscription: true, subscribed: sub.status === 'active' || isTrial, status: sub.status, plan: sub.plan?.name, planId: sub.planId, trialDays: sub.trialDays, trialEndsAt: sub.trialEndsAt, trialExpired, startDate: sub.startDate };
  }

  async findAllInvoices(companyId: string, query?: any) {
    const where: any = { companyId };
    if (query?.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50, include: { plan: { select: { name: true } } } }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, total };
  }

  async findInvoice(id: string, companyId: string) {
    return this.prisma.invoice.findFirst({ where: { id, companyId }, include: { plan: { select: { name: true } } } });
  }
}
