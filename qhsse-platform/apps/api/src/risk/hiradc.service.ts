import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHiradcDto, AddHazardDto } from './dto/hiradc.dto';

@Injectable()
export class HiradcService {
  constructor(private prisma: PrismaService) {}

  async calculateRisk(severity: number, likelihood: number, companyId: string) {
    const score = (severity || 1) * (likelihood || 1);
    const matrix = await this.prisma.riskMatrixDefinition.findUnique({ where: { companyId }, include: { cells: true } });
    const cell = matrix?.cells?.find(c => c.severity === severity && c.likelihood === likelihood);
    return { score, riskLevel: cell?.riskLevel || null, riskLabel: cell?.riskLabel || null, color: cell?.color || null };
  }

  async create(dto: CreateHiradcDto, companyId: string, userId: string) {
    const record = await this.prisma.hiradcRecord.create({
      data: { companyId, title: dto.title, description: dto.description, department: dto.department, location: dto.location, assessorId: dto.assessorId, createdBy: userId },
    });
    if (dto.activities) {
      for (let i = 0; i < dto.activities.length; i++) {
        await this.prisma.hiradcActivity.create({ data: { recordId: record.id, companyId, name: dto.activities[i].name, routine: dto.activities[i].routine||false, nonRoutine: dto.activities[i].nonRoutine||false, emergency: dto.activities[i].emergency||false, sortOrder: i } });
      }
    }
    return this.findOne(record.id, companyId);
  }

  async findAll(companyId: string) {
    return this.prisma.hiradcRecord.findMany({ where: { companyId, deletedAt: null }, include: { _count: { select: { activities: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, companyId: string) {
    const record = await this.prisma.hiradcRecord.findUnique({ where: { id }, include: { activities: { orderBy: { sortOrder: 'asc' }, include: { hazards: { orderBy: { sortOrder: 'asc' } } } } } });
    if (!record) throw new NotFoundException('HIRADC record not found');
    if (record.companyId !== companyId) throw new ForbiddenException('Access denied');
    return record;
  }

  async softDelete(id: string, companyId: string) {
    const r = await this.findOne(id, companyId);
    if (r.status !== 'draft') throw new ForbiddenException('Only drafts can be deleted');
    await this.prisma.hiradcRecord.update({ where: { id }, data: { deletedAt: new Date(), status: 'closed' } });
    return { success: true };
  }

  async submit(id: string, companyId: string) {
    const r = await this.findOne(id, companyId);
    if (r.status !== 'draft') throw new ForbiddenException('Only drafts can be submitted');
    return this.prisma.hiradcRecord.update({ where: { id }, data: { status: 'submitted' } });
  }

  async addActivity(id: string, name: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.hiradcActivity.create({ data: { recordId: id, companyId, name } });
  }

  async addHazard(dto: AddHazardDto, companyId: string) {
    const initialScore = await this.calculateRisk(dto.initialSeverity||1, dto.initialLikelihood||1, companyId);
    const residualScore = (dto.residualSeverity && dto.residualLikelihood) ? await this.calculateRisk(dto.residualSeverity, dto.residualLikelihood, companyId) : null;
    return this.prisma.hiradcHazard.create({
      data: {
        activityId: dto.activityId, recordId: (await this.prisma.hiradcActivity.findUnique({ where: { id: dto.activityId } }))?.recordId || '', companyId,
        hazardDesc: dto.hazardDescription, consequence: dto.consequence, existingControls: dto.existingControls,
        initialSeverity: dto.initialSeverity, initialLikelihood: dto.initialLikelihood, initialRiskScore: initialScore.score, initialRiskLevel: initialScore.riskLevel,
        additionalControls: dto.additionalControls,
        residualSeverity: dto.residualSeverity, residualLikelihood: dto.residualLikelihood, residualRiskScore: residualScore?.score, residualRiskLevel: residualScore?.riskLevel,
        pic: dto.pic, dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async updateHazard(hazardId: string, data: any, companyId: string) {
    if (data.initialSeverity || data.initialLikelihood) {
      const sev = data.initialSeverity || 1; const lik = data.initialLikelihood || 1;
      const initialScore = await this.calculateRisk(sev, lik, companyId);
      data.initialRiskScore = initialScore.score; data.initialRiskLevel = initialScore.riskLevel;
    }
    if (data.residualSeverity && data.residualLikelihood) {
      const residualScore = await this.calculateRisk(data.residualSeverity, data.residualLikelihood, companyId);
      data.residualRiskScore = residualScore.score; data.residualRiskLevel = residualScore.riskLevel;
    }
    return this.prisma.hiradcHazard.update({ where: { id: hazardId }, data });
  }
}
