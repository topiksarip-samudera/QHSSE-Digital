import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRiskSettingsDto } from './dto/risk-settings.dto';

const DEFAULT_SEVERITY = [
  { level: 1, label: 'Insignificant', code: 'insignificant', description: 'No injury / negligible damage' },
  { level: 2, label: 'Minor', code: 'minor', description: 'First aid / minor damage' },
  { level: 3, label: 'Moderate', code: 'moderate', description: 'Medical treatment / moderate damage' },
  { level: 4, label: 'Major', code: 'major', description: 'Serious injury / major damage' },
  { level: 5, label: 'Catastrophic', code: 'catastrophic', description: 'Fatality / catastrophic damage' },
];
const DEFAULT_LIKELIHOOD = [
  { level: 1, label: 'Rare', code: 'rare', description: 'Almost never occurs' },
  { level: 2, label: 'Unlikely', code: 'unlikely', description: 'Could occur occasionally' },
  { level: 3, label: 'Possible', code: 'possible', description: 'May occur sometimes' },
  { level: 4, label: 'Likely', code: 'likely', description: 'Probably occurs' },
  { level: 5, label: 'Almost Certain', code: 'almost_certain', description: 'Almost always occurs' },
];
const DEFAULT_RISK_LEVELS = [
  { level: 'L', label: 'Low', color: '#22c55e', scoreMin: 1, scoreMax: 6 },
  { level: 'M', label: 'Medium', color: '#eab308', scoreMin: 7, scoreMax: 12 },
  { level: 'H', label: 'High', color: '#f97316', scoreMin: 13, scoreMax: 19 },
  { level: 'E', label: 'Extreme', color: '#ef4444', scoreMin: 20, scoreMax: 25 },
];

const RISK_MASTER_DATA = [
  { group: 'Hazard Category', items: ['Physical', 'Chemical', 'Biological', 'Ergonomic', 'Psychosocial', 'Mechanical', 'Electrical', 'Radiation', 'Noise', 'Vibration', 'Working at Height', 'Confined Space', 'Excavation', 'Lifting Operations', 'Hot Work', 'Pressure System', 'Environmental'] },
  { group: 'Hazard Type', items: ['Slip/Trip/Fall', 'Struck By', 'Caught In/Between', 'Fire/Explosion', 'Chemical Exposure', 'Electrical Shock', 'Overexertion', 'Repetitive Motion', 'Vehicle Accident', 'Equipment Failure', 'Structural Collapse', 'Drowning', 'Asphyxiation', 'Burns', 'Poisoning', 'Radiation Exposure'] },
  { group: 'Consequence Type', items: ['Injury', 'Fatality', 'Property Damage', 'Environmental Damage', 'Production Loss', 'Legal Action', 'Reputation Damage', 'Regulatory Fine', 'Business Interruption', 'Data Loss'] },
  { group: 'Control Type', items: ['Elimination', 'Substitution', 'Engineering Controls', 'Administrative Controls', 'Personal Protective Equipment', 'Warning Systems', 'Procedures', 'Training', 'Supervision', 'Permit to Work'] },
  { group: 'Risk Category', items: ['Safety', 'Health', 'Environment', 'Quality', 'Security', 'Legal', 'Financial', 'Operational', 'Reputation', 'Strategic'] },
  { group: 'Risk Status', items: ['Draft', 'Identified', 'Assessed', 'Under Review', 'Approved', 'Active', 'Monitoring', 'Closed', 'Expired'] },
  { group: 'Review Frequency', items: ['Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually', 'Event-Based'] },
];

@Injectable()
export class RiskService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.riskSetting.findUnique({ where: { companyId } });
    if (!s) {
      s = await this.prisma.riskSetting.create({
        data: { companyId, severityLevels: DEFAULT_SEVERITY, likelihoodLevels: DEFAULT_LIKELIHOOD, riskLevels: DEFAULT_RISK_LEVELS, matrixType: '5x5', requireWorkflow: true, maxReviewDays: 90 },
      });
    }
    return s;
  }

  async updateSettings(companyId: string, dto: UpdateRiskSettingsDto) {
    return this.prisma.riskSetting.upsert({
      where: { companyId },
      create: { companyId, severityLevels: dto.severityLevels || DEFAULT_SEVERITY, likelihoodLevels: dto.likelihoodLevels || DEFAULT_LIKELIHOOD, riskLevels: dto.riskLevels || DEFAULT_RISK_LEVELS, ...dto },
      update: { ...dto, severityLevels: dto.severityLevels as any, likelihoodLevels: dto.likelihoodLevels as any, riskLevels: dto.riskLevels as any },
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
    for (const group of RISK_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) {
        mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), description: `Risk Management - ${group.group}`, companyId } });
      }
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) {
          await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\/\s]+/g, '_'), sortOrder: i, companyId } });
          count++;
        }
      }
    }
    return { seeded: count, groups: RISK_MASTER_DATA.length };
  }
}
