import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JsaService {
  constructor(private prisma: PrismaService) {}

  async calculateRisk(severity: number, likelihood: number, companyId: string) {
    const score = (severity || 1) * (likelihood || 1);
    const matrix = await this.prisma.riskMatrixDefinition.findUnique({ where: { companyId }, include: { cells: true } });
    const cell = matrix?.cells?.find(c => c.severity === severity && c.likelihood === likelihood);
    return { score, riskLevel: cell?.riskLevel || null, riskLabel: cell?.riskLabel || null };
  }

  async create(data: { title: string; jobTitle?: string; department?: string; siteId?: string }, companyId: string, userId: string) {
    return this.prisma.jsaTemplate.create({ data: { companyId, title: data.title, jobTitle: data.jobTitle, department: data.department, siteId: data.siteId, createdBy: userId } });
  }

  async findAll(companyId: string) {
    return this.prisma.jsaTemplate.findMany({ where: { companyId, deletedAt: null }, include: { _count: { select: { steps: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, companyId: string) {
    const jsa = await this.prisma.jsaTemplate.findUnique({ where: { id }, include: { steps: { orderBy: { stepNumber: 'asc' }, include: { hazards: { orderBy: { sortOrder: 'asc' } }, controls: { orderBy: { sortOrder: 'asc' } } } } } });
    if (!jsa) throw new NotFoundException('JSA not found');
    if (jsa.companyId !== companyId) throw new ForbiddenException('Access denied');
    return jsa;
  }

  async softDelete(id: string, companyId: string) {
    const jsa = await this.findOne(id, companyId);
    if (jsa.status !== 'draft') throw new ForbiddenException('Only drafts can be deleted');
    await this.prisma.jsaTemplate.update({ where: { id }, data: { deletedAt: new Date(), status: 'closed' } });
    return { success: true };
  }

  async submit(id: string, companyId: string) {
    const jsa = await this.findOne(id, companyId);
    if (jsa.status !== 'draft') throw new ForbiddenException('Only drafts can be submitted');
    return this.prisma.jsaTemplate.update({ where: { id }, data: { status: 'submitted' } });
  }

  async addStep(id: string, description: string, companyId: string, userId: string) {
    const jsa = await this.findOne(id, companyId);
    const stepCount = await this.prisma.jsaStep.count({ where: { jsaId: id } });
    return this.prisma.jsaStep.create({ data: { jsaId: id, stepNumber: stepCount + 1, stepDescription: description } });
  }

  async addHazard(stepId: string, data: { hazardDesc: string; consequence?: string; initialSeverity?: number; initialLikelihood?: number }, companyId: string) {
    const step = await this.prisma.jsaStep.findUnique({ where: { id: stepId } });
    const initialRisk = await this.calculateRisk(data.initialSeverity || 1, data.initialLikelihood || 1, companyId);
    return this.prisma.jsaStepHazard.create({
      data: { stepId, jsaId: step?.jsaId || '', companyId, hazardDesc: data.hazardDesc, consequence: data.consequence,
        initialSeverity: data.initialSeverity, initialLikelihood: data.initialLikelihood, initialRiskScore: initialRisk.score, initialRiskLevel: initialRisk.riskLevel },
    });
  }

  async addControl(stepId: string, data: { controlType: string; description: string; ppeRequired?: string; hazardId?: string }, companyId: string) {
    const step = await this.prisma.jsaStep.findUnique({ where: { id: stepId } });
    return this.prisma.jsaStepControl.create({ data: { stepId, hazardId: data.hazardId, jsaId: step?.jsaId || '', companyId, controlType: data.controlType, description: data.description, ppeRequired: data.ppeRequired } });
  }
}
