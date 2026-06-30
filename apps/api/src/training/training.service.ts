import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTrainingSettingsDto } from './dto/training-settings.dto';

const TRAINING_MASTER_DATA = [
  { group: 'Training Type', items: ['Induction', 'Working at Height', 'Confined Space', 'Hot Work', 'LOTO', 'First Aid', 'Fire Fighting', 'Defensive Driving', 'Lifting & Rigging', 'Chemical Handling', 'Emergency Response', 'Permit to Work', 'Risk Assessment', 'Incident Investigation', 'Audit Training', 'ISO Awareness'] },
  { group: 'Training Category', items: ['Safety', 'Health', 'Environment', 'Technical', 'Management', 'Legal', 'Quality', 'Security'] },
  { group: 'Training Status', items: ['Planned', 'Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed', 'Expired'] },
  { group: 'Competency Category', items: ['Core', 'Functional', 'Technical', 'Leadership', 'HSE', 'Regulatory'] },
  { group: 'Competency Level', items: ['Novice', 'Beginner', 'Competent', 'Proficient', 'Expert'] },
  { group: 'Certificate Type', items: ['Induction Card', 'Training Certificate', 'Competency Card', 'License', 'Permit Card', 'Medical Fitness', 'Welder Cert', 'Driver License', 'Operator License', 'Radiation Safety'] },
  { group: 'Certificate Status', items: ['Active', 'Expired', 'Suspended', 'Revoked', 'Pending Renewal'] },
  { group: 'Attendance Status', items: ['Attended', 'Partial', 'Absent', 'Excused', 'Late'] },
  { group: 'Training Need Source', items: ['Performance Appraisal', 'Job Change', 'Incident', 'Audit Finding', 'Regulatory', 'Management Review', 'Self-Assessment'] },
  { group: 'Induction Type', items: ['General HSE', 'Site', 'Contractor', 'Visitor', 'Executive'] },
  { group: 'Toolbox Topic Category', items: ['General Safety', 'Work at Height', 'Electrical', 'Fire', 'Chemical', 'LOTO', 'Driving', 'Environment', 'Health', 'Emergency'] },
  { group: 'Validation Mode', items: ['Block', 'Warning', 'Info'] },
  { group: 'Training Matrix Requirement', items: ['Mandatory', 'Recommended', 'Optional', 'Conditional'] },
  { group: 'Competency Assessment Method', items: ['Written Test', 'Practical Demo', 'Interview', 'Observation', 'Portfolio', 'Third Party'] },
  { group: 'Competency Revalidation Period', items: ['6 Months', '12 Months', '24 Months', '36 Months', '48 Months'] },
  { group: 'Assessment Frequency', items: ['Monthly', 'Quarterly', 'Bi-Annually', 'Annually', 'Event-Based'] },
];

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.trainingSetting.findUnique({ where: { companyId } });
    if (!s) s = await this.prisma.trainingSetting.create({ data: { companyId } });
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateTrainingSettingsDto) {
    return this.prisma.trainingSetting.upsert({ where: { companyId }, create: { companyId, ...dto }, update: dto });
  }

  async getMasterData(companyId: string) {
    return this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] },
      include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  }

  async seedDefaults(companyId: string) {
    let count = 0;
    for (const group of TRAINING_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), companyId } });
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\s\/]+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: TRAINING_MASTER_DATA.length };
  }

  // ─── Training Links (cross-module) ─────────────────────────────────────

  async findAllLinks(companyId: string, query?: { trainingId?: string; linkedModule?: string }) {
    const where: any = { companyId, deletedAt: null };
    if (query?.trainingId) where.trainingId = query.trainingId;
    if (query?.linkedModule) where.linkedModule = query.linkedModule;
    const [data, total] = await Promise.all([
      this.prisma.trainingLink.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.trainingLink.count({ where }),
    ]);
    return { data, total };
  }

  async createLink(companyId: string, userId: string, dto: any) {
    return this.prisma.trainingLink.create({ data: { ...dto, companyId, createdBy: userId } });
  }

  async deleteLink(id: string, companyId: string) {
    await this.prisma.trainingLink.findFirstOrThrow({ where: { id, companyId, deletedAt: null } });
    return this.prisma.trainingLink.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
