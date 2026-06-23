import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAuditInspectionSettingsDto } from './dto/audit-inspection-settings.dto';

const AUDIT_MASTER_DATA = [
  { group: 'Audit Type', items: ['Internal Audit', 'External Audit', 'Supplier Audit', 'Regulatory Audit', 'Certification Audit', 'Surveillance Audit', 'Gap Assessment'] },
  { group: 'Inspection Type', items: ['Routine Inspection', 'Planned General', 'Spot Check', 'Pre-Use', 'Regulatory', 'Contractor', 'Walkthrough', 'Management Walkabout'] },
  { group: 'Finding Type', items: ['Nonconformity', 'Observation', 'Opportunity for Improvement', 'Positive Finding', 'Best Practice'] },
  { group: 'Finding Category', items: ['Documentation', 'Implementation', 'Effectiveness', 'Training', 'Communication', 'Monitoring', 'Management Review', 'Resource'] },
  { group: 'Finding Severity', items: ['Critical', 'Major', 'Minor', 'Observation'] },
  { group: 'Finding Status', items: ['Open', 'Action Assigned', 'Action In Progress', 'Under Review', 'Verified', 'Closed', 'Reopened'] },
  { group: 'Audit Status', items: ['Planned', 'Scheduled', 'In Progress', 'Draft Report', 'Under Review', 'Final', 'Closed', 'Cancelled'] },
  { group: 'Inspection Status', items: ['Planned', 'Scheduled', 'In Progress', 'Completed', 'Reported', 'Closed', 'Cancelled'] },
  { group: 'Audit Criteria', items: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 50001', 'Internal Procedure', 'Regulatory', 'Client Requirement', 'Legal'] },
  { group: 'Auditor Role', items: ['Lead Auditor', 'Auditor', 'Technical Expert', 'Observer', 'Guide'] },
  { group: 'Compliance Rating', items: ['Conforming', 'Conforming with Observation', 'Nonconforming Minor', 'Nonconforming Major', 'Not Applicable'] },
  { group: 'Answer Rating', items: ['Pass', 'Fail', 'Partial', 'Not Applicable', 'Not Checked'] },
];

@Injectable()
export class AuditInspectionService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.auditInspectionSetting.findUnique({ where: { companyId } });
    if (!s) {
      s = await this.prisma.auditInspectionSetting.create({
        data: { companyId, defaultFindingDueDays: 14, autoCreateAction: true, requireEvidenceMajorNc: true, requireRootCauseMajorNc: true, scoreFailedCriticalAsZero: true, passScorePercent: 75 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateAuditInspectionSettingsDto) {
    return this.prisma.auditInspectionSetting.upsert({
      where: { companyId },
      create: { companyId, ...dto },
      update: dto,
    });
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
    for (const group of AUDIT_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), companyId } });
      }
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\s\/]+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: AUDIT_MASTER_DATA.length };
  }
}
