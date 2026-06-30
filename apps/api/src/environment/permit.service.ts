import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentPermitService {
  constructor(private prisma: PrismaService) {}

  async createPermit(data: any, companyId: string, userId: string) {
    return this.prisma.environmentPermit.create({
      data: { companyId, title: data.title, description: data.description, permitId: data.permitId,
        issuingAuthority: data.issuingAuthority, permitNumber: data.permitNumber,
        issuedDate: data.issuedDate ? new Date(data.issuedDate) : null, expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        renewalDue: data.renewalDue ? new Date(data.renewalDue) : null, status: 'active', responsibleId: data.responsibleId, createdBy: userId,
      },
    });
  }

  async getPermits(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.status) where.status = query.status;
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.environmentPermit.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async findOne(id: string, companyId: string) {
    const permit = await this.prisma.environmentPermit.findUnique({ where: { id } });
    if (!permit || permit.companyId !== companyId) throw new NotFoundException('Permit not found');
    return permit;
  }

  async updatePermit(id: string, data: any, companyId: string) {
    await this.findOne(id, companyId);
    if (data.issuedDate) data.issuedDate = new Date(data.issuedDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);
    if (data.renewalDue) data.renewalDue = new Date(data.renewalDue);
    return this.prisma.environmentPermit.update({ where: { id }, data });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.environmentPermit.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  // ─── Expiry & Renewal ──────────────────────────────────────────────────

  async getExpiringPermits(companyId: string, days: number = 30) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return this.prisma.environmentPermit.findMany({
      where: { companyId, deletedAt: null, status: 'active', expiryDate: { lte: future } },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async getComplianceStatus(companyId: string) {
    const [active, expired, pending, suspended] = await Promise.all([
      this.prisma.environmentPermit.count({ where: { companyId, deletedAt: null, status: 'active' } }),
      this.prisma.environmentPermit.count({ where: { companyId, deletedAt: null, status: 'expired' } }),
      this.prisma.environmentPermit.count({ where: { companyId, deletedAt: null, status: 'pending' } }),
      this.prisma.environmentPermit.count({ where: { companyId, deletedAt: null, status: 'suspended' } }),
    ]);
    return { active, expired, pending, suspended, total: active + expired + pending + suspended };
  }
}
