import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessPolicyDto, CreateTempAccessDto, PermissionSimulatorDto, PolicyQueryDto } from './dto/advanced-permission.dto';

@Injectable()
export class AdvancedPermissionService {
  constructor(private prisma: PrismaService) {}

  async createPolicy(dto: CreateAccessPolicyDto, companyId: string, userId: string) {
    return this.prisma.accessPolicy.create({ data: { companyId, name: dto.name, description: dto.description, module: dto.module, rules: dto.rules || {}, createdBy: userId } });
  }

  async getPolicies(companyId: string, query: PolicyQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId };
    if (query.module) where.module = query.module;
    const [data, total] = await Promise.all([
      this.prisma.accessPolicy.findMany({ where, orderBy: { priority: 'desc' }, skip, take: limit }),
      this.prisma.accessPolicy.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updatePolicy(id: string, data: any, companyId: string) {
    const p = await this.prisma.accessPolicy.findUnique({ where: { id } });
    if (!p || p.companyId !== companyId) throw new NotFoundException('Not found');
    return this.prisma.accessPolicy.update({ where: { id }, data });
  }

  async deletePolicy(id: string) {
    await this.prisma.accessPolicy.delete({ where: { id } });
    return { success: true };
  }

  async simulate(dto: PermissionSimulatorDto, companyId: string) {
    const policies = await this.prisma.accessPolicy.findMany({ where: { companyId, module: dto.module, isActive: true } });
    const tempAccess = await this.prisma.temporaryAccessGrant.findMany({ where: { userId: dto.userId, module: dto.module, expiresAt: { gte: new Date() } } });
    const recordPerms = dto.recordId ? await this.prisma.recordPermission.findMany({ where: { module: dto.module, recordId: dto.recordId } }) : [];

    const applicableRules: any[] = [];
    for (const p of policies) {
      const rules = p.rules as any[];
      if (rules) for (const r of rules) applicableRules.push({ policy: p.name, ...r });
    }

    return {
      userId: dto.userId,
      module: dto.module,
      action: dto.action,
      applicablePolicies: applicableRules.length,
      activePolicies: policies.map((p: any) => p.name),
      temporaryAccess: tempAccess.length > 0,
      recordLevelPermissions: recordPerms.length,
      summary: policies.length > 0 ? 'Has applicable policies' : 'No policies — default access applies',
    };
  }

  async createTempAccess(dto: CreateTempAccessDto, companyId: string, userId: string) {
    return this.prisma.temporaryAccessGrant.create({
      data: { companyId, userId: dto.userId, module: dto.module, recordId: dto.recordId, access: dto.access || 'read', reason: dto.reason, grantedBy: userId, expiresAt: new Date(dto.expiresAt) },
    });
  }

  async getTempAccess(companyId: string) {
    return this.prisma.temporaryAccessGrant.findMany({ where: { companyId, expiresAt: { gte: new Date() } }, orderBy: { expiresAt: 'asc' } });
  }

  async revokeTempAccess(id: string) {
    await this.prisma.temporaryAccessGrant.delete({ where: { id } });
    return { success: true };
  }

  async getDataMasking(companyId: string) {
    return this.prisma.dataMaskingRule.findMany({ where: { companyId } });
  }

  async createDataMasking(companyId: string, data: any) {
    return this.prisma.dataMaskingRule.create({ data: { ...data, companyId } });
  }
}
