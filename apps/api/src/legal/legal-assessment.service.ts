import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto, CreateGapAnalysisDto, UpdateGapDto } from './dto/assessment.dto';

@Injectable()
export class LegalAssessmentService {
  constructor(private prisma: PrismaService) {}

  // ─── Compliance Assessments ─────────────────────────────────────────────

  async createAssessment(dto: CreateAssessmentDto, companyId: string, userId: string) {
    return this.prisma.legalComplianceAssessment.create({
      data: { ...dto, companyId, assessedBy: userId },
    });
  }

  async findAllAssessments(companyId: string, query: any) {
    const { result, page = 1, limit = 20 } = query || {};
    const where: any = { companyId };
    if (result) where.result = result;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.legalComplianceAssessment.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.legalComplianceAssessment.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findAssessment(id: string, companyId: string) {
    const a = await this.prisma.legalComplianceAssessment.findUnique({ where: { id } });
    if (!a || a.companyId !== companyId) throw new NotFoundException('Assessment not found');
    return a;
  }

  // ─── Gap Analysis ───────────────────────────────────────────────────────

  async createGap(dto: CreateGapAnalysisDto, companyId: string, userId: string) {
    return this.prisma.legalGapAnalysis.create({
      data: { ...dto, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined, companyId, createdBy: userId },
    });
  }

  async findAllGaps(companyId: string, query: any) {
    const { status, impact, page = 1, limit = 20 } = query || {};
    const where: any = { companyId };
    if (status) where.status = status;
    if (impact) where.impact = impact;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.legalGapAnalysis.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.legalGapAnalysis.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findGap(id: string, companyId: string) {
    const g = await this.prisma.legalGapAnalysis.findUnique({ where: { id } });
    if (!g || g.companyId !== companyId) throw new NotFoundException('Gap analysis not found');
    return g;
  }

  async updateGap(id: string, dto: UpdateGapDto, companyId: string) {
    await this.findGap(id, companyId);
    return this.prisma.legalGapAnalysis.update({
      where: { id },
      data: { ...dto, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined },
    });
  }

  // ─── Compliance Score ───────────────────────────────────────────────────

  async getScore(companyId: string) {
    let score = await this.prisma.legalComplianceScore.findUnique({ where: { companyId } });
    if (!score) {
      score = await this.prisma.legalComplianceScore.create({ data: { companyId } });
    }
    return this.calculateScore(companyId);
  }

  async calculateScore(companyId: string) {
    const assessments = await this.prisma.legalComplianceAssessment.findMany({ where: { companyId } });
    const compliant = assessments.filter(a => a.result === 'compliant').length;
    const nonCompliant = assessments.filter(a => a.result === 'non_compliant').length;
    const partially = assessments.filter(a => a.result === 'partially_compliant').length;
    const total = assessments.length;
    const percentage = total > 0 ? Number(((compliant / total) * 100).toFixed(1)) : 0;
    const totalScore = compliant * 100 + partially * 50;
    const maxScore = total * 100;

    return this.prisma.legalComplianceScore.upsert({
      where: { companyId },
      create: { companyId, totalScore, maxScore: maxScore || 100, percentage, compliant, nonCompliant, partially },
      update: { totalScore, maxScore: maxScore || 100, percentage, compliant, nonCompliant, partially },
    });
  }
}
