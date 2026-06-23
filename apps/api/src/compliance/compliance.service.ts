import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessReviewDto, CreatePermissionReviewDto, AcknowledgePolicyDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async createAccessReview(dto: CreateAccessReviewDto, companyId: string, reviewerId: string) {
    return this.prisma.accessReview.create({ data: { companyId, userId: dto.userId, reviewerId, access: dto.access || {}, notes: dto.notes } });
  }

  async getAccessReviews(companyId: string) {
    return this.prisma.accessReview.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async updateAccessReview(id: string, status: string, userId: string, companyId: string) {
    return this.prisma.accessReview.update({ where: { id }, data: { status, reviewedAt: new Date() } });
  }

  async createPermissionReview(dto: CreatePermissionReviewDto, companyId: string, reviewerId: string) {
    return this.prisma.permissionReview.create({ data: { companyId, roleId: dto.roleId, reviewerId, findings: dto.findings } });
  }

  async getPermissionReviews(companyId: string) {
    return this.prisma.permissionReview.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async acknowledgePolicy(dto: AcknowledgePolicyDto, companyId: string, userId: string) {
    return this.prisma.policyAcknowledgement.upsert({
      where: { userId_policyName: { userId, policyName: dto.policyName } },
      create: { companyId, userId, policyName: dto.policyName, version: dto.version || 1 },
      update: { version: dto.version || 1, acknowledgedAt: new Date() },
    });
  }

  async getAcknowledgements(companyId: string) {
    return this.prisma.policyAcknowledgement.findMany({ where: { companyId }, orderBy: { acknowledgedAt: 'desc' }, take: 50 });
  }

  async getComplianceScore(companyId: string) {
    const [accessCount, permCount, policyCount, scored] = await Promise.all([
      this.prisma.accessReview.count({ where: { companyId, status: 'approved' } }),
      this.prisma.permissionReview.count({ where: { companyId, status: 'reviewed' } }),
      this.prisma.policyAcknowledgement.count({ where: { companyId } }),
      this.prisma.complianceScore.findUnique({ where: { companyId } }),
    ]);

    const score = Math.min(100, (accessCount * 25) + (permCount * 25) + (Math.min(policyCount, 4) * 12.5));

    await this.prisma.complianceScore.upsert({
      where: { companyId },
      create: { companyId, score, access: Math.min(25, accessCount * 25), permissions: Math.min(25, permCount * 25), policies: Math.min(50, Math.min(policyCount, 4) * 12.5), admin: 0 },
      update: { score, access: Math.min(25, accessCount * 25), permissions: Math.min(25, permCount * 25), policies: Math.min(50, Math.min(policyCount, 4) * 12.5) },
    });

    return { totalScore: score, breakdown: { access: Math.min(25, accessCount * 25), permissions: Math.min(25, permCount * 25), policies: Math.min(50, Math.min(policyCount, 4) * 12.5) }, details: { accessReviews: accessCount, permissionReviews: permCount, policiesAcknowledged: policyCount } };
  }
}
