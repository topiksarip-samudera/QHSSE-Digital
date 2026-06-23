import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookDto, UpdateWebhookDto, WebhookQueryDto } from './dto/webhook.dto';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebhookDto, companyId: string, userId: string) {
    const secret = dto.secret || crypto.randomBytes(16).toString('hex');
    const webhook = await this.prisma.webhook.create({
      data: { companyId, name: dto.name, url: dto.url, description: dto.description, secret, createdBy: userId },
    });
    if (dto.events) {
      for (const event of dto.events) {
        await this.prisma.webhookEvent.create({ data: { webhookId: webhook.id, event } });
      }
    }
    return { ...webhook, secret }; // show secret on creation only
  }

  async findAll(companyId: string, query: WebhookQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.isActive !== undefined) where.isActive = query.isActive;
    const [data, total] = await Promise.all([
      this.prisma.webhook.findMany({ where, include: { events: true, _count: { select: { logs: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.webhook.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const w = await this.prisma.webhook.findUnique({ where: { id }, include: { events: true } });
    if (!w) throw new NotFoundException('Not found');
    if (w.companyId !== companyId) throw new ForbiddenException('Access denied');
    return w;
  }

  async update(id: string, dto: UpdateWebhookDto, companyId: string) {
    const w = await this.findOne(id, companyId);
    await this.prisma.webhook.update({
      where: { id },
      data: { name: dto.name ?? w.name, url: dto.url ?? w.url, isActive: dto.isActive ?? w.isActive, description: dto.description !== undefined ? dto.description : w.description },
    });
    if (dto.events) {
      await this.prisma.webhookEvent.deleteMany({ where: { webhookId: id } });
      for (const event of dto.events) {
        await this.prisma.webhookEvent.create({ data: { webhookId: id, event } });
      }
    }
    return this.findOne(id, companyId);
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.webhook.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return { success: true };
  }

  async test(id: string, companyId: string) {
    const w = await this.findOne(id, companyId);
    const payload = { test: true, webhook: w.name, timestamp: new Date().toISOString(), events: w.events.map((e: any) => e.event) };
    const signature = crypto.createHmac('sha256', w.secret || '').update(JSON.stringify(payload)).digest('hex');

    const start = Date.now();
    try {
      const response = await fetch(w.url, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': signature },
        body: JSON.stringify(payload),
      });
      const body = await response.text();
      const duration = Date.now() - start;
      await this.prisma.webhookLog.create({
        data: { webhookId: id, companyId, event: 'test', statusCode: response.status, responseBody: body.slice(0, 1000), payload, duration },
      });
      return { success: response.ok, statusCode: response.status, duration, signature };
    } catch (err: any) {
      const duration = Date.now() - start;
      await this.prisma.webhookLog.create({ data: { webhookId: id, companyId, event: 'test', statusCode: 0, payload, duration, error: err.message } });
      return { success: false, error: err.message, duration };
    }
  }

  async getLogs(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.webhookLog.findMany({ where: { webhookId: id }, orderBy: { createdAt: 'desc' }, take: 50 });
  }
}
