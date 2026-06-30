import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GapAnalysisService {
  constructor(private prisma: PrismaService) {}

  async getGapAnalysis(companyId: string) {
    const matrices = await this.prisma.trainingMatrix.findMany({ where: { companyId, deletedAt: null } });
    const assessments = await this.prisma.competencyAssessment.findMany({ where: { companyId } });
    const gaps: any[] = [];
    for (const matrix of matrices) {
      const matrixAssessments = assessments.filter(a => a.matrixId === matrix.id);
      if (matrixAssessments.length === 0) { gaps.push({ matrixId: matrix.id, name: matrix.name, type: matrix.type, requiredLevel: matrix.requiredLevel, assessed: 0, compliant: 0, nonCompliant: 0, gap: 'no_assessment' }); continue; }
      const compliant = matrixAssessments.filter(a => a.result === 'pass').length;
      gaps.push({ matrixId: matrix.id, name: matrix.name, type: matrix.type, requiredLevel: matrix.requiredLevel, assessed: matrixAssessments.length, compliant, nonCompliant: matrixAssessments.length - compliant, gap: compliant === matrixAssessments.length ? 'none' : 'partial' });
    }
    return { data: gaps, total: gaps.length };
  }

  async getUserGapAnalysis(userId: string, companyId: string) {
    const matrices = await this.prisma.trainingMatrix.findMany({ where: { companyId, deletedAt: null } });
    const assessments = await this.prisma.competencyAssessment.findMany({ where: { companyId, userId } });
    const gaps: any[] = [];
    for (const matrix of matrices) {
      const userAssessment = assessments.find(a => a.matrixId === matrix.id);
      gaps.push({ matrixId: matrix.id, name: matrix.name, type: matrix.type, requiredLevel: matrix.requiredLevel, assessed: !!userAssessment, result: userAssessment?.result || 'not_assessed', compliant: userAssessment?.result === 'pass' });
    }
    return { userId, data: gaps, total: gaps.length, compliantCount: gaps.filter(g => g.compliant).length };
  }
}
