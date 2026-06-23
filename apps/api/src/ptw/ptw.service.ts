import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePermitSettingsDto } from './dto/ptw-settings.dto';

const PERMIT_TYPES = [
  { name: 'Hot Work', code: 'hot_work', category: 'hot_work', riskLevel: 'high', requireJsa: true, requireGasTest: true, maxDurationHrs: 8 },
  { name: 'Cold Work', code: 'cold_work', category: 'cold_work', riskLevel: 'low', requireJsa: false, maxDurationHrs: 12 },
  { name: 'Working at Height', code: 'working_at_height', category: 'height', riskLevel: 'high', requireJsa: true, maxDurationHrs: 8 },
  { name: 'Confined Space Entry', code: 'confined_space', category: 'confined_space', riskLevel: 'critical', requireJsa: true, requireGasTest: true, maxDurationHrs: 8 },
  { name: 'Electrical Work', code: 'electrical', category: 'electrical', riskLevel: 'high', requireLoto: true, maxDurationHrs: 10 },
  { name: 'Lifting Operation', code: 'lifting', category: 'lifting', riskLevel: 'high', requireJsa: true, maxDurationHrs: 8 },
  { name: 'Excavation', code: 'excavation', category: 'excavation', riskLevel: 'high', requireJsa: true, maxDurationHrs: 12 },
  { name: 'LOTO', code: 'loto', category: 'loto', riskLevel: 'high', requireLoto: true, maxDurationHrs: 8 },
  { name: 'Radiography', code: 'radiography', category: 'radiography', riskLevel: 'high', maxDurationHrs: 8 },
  { name: 'Chemical Work', code: 'chemical', category: 'chemical', riskLevel: 'high', requireJsa: true, maxDurationHrs: 10 },
  { name: 'Line Breaking', code: 'line_breaking', category: 'line_breaking', riskLevel: 'high', requireLoto: true, maxDurationHrs: 8 },
  { name: 'Pressure Testing', code: 'pressure_testing', category: 'pressure_testing', riskLevel: 'high', maxDurationHrs: 8 },
  { name: 'Night Work', code: 'night_work', category: 'night_work', riskLevel: 'medium', maxDurationHrs: 10 },
  { name: 'SIMOPS', code: 'simops', category: 'simops', riskLevel: 'high', requireSimops: true, maxDurationHrs: 8 },
];

const PTW_MASTER_DATA = [
  { group: 'Permit Work Category', items: ['Hot Work', 'Cold Work', 'Height', 'Confined Space', 'Electrical', 'Lifting', 'Excavation', 'LOTO', 'Radiography', 'Chemical', 'Line Breaking', 'Pressure Testing', 'Night Work', 'SIMOPS'] },
  { group: 'Permit Status', items: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Active', 'Suspended', 'Extended', 'Closed', 'Cancelled'] },
  { group: 'Permit Risk Level', items: ['Low', 'Medium', 'High', 'Critical'] },
  { group: 'PPE Type', items: ['Safety Helmet', 'Safety Glasses', 'Face Shield', 'Safety Gloves', 'Safety Boots', 'Coverall', 'Apron', 'Respirator', 'Ear Plugs', 'Safety Harness', 'Life Jacket', 'Welding Mask'] },
  { group: 'Energy Type', items: ['Electrical', 'Mechanical', 'Chemical', 'Thermal', 'Hydraulic', 'Pneumatic', 'Gravity', 'Radiation'] },
  { group: 'Isolation Type', items: ['Lockout', 'Tagout', 'Blind/Blanking', 'Double Block & Bleed', 'Disconnection', 'Physical Barrier'] },
  { group: 'Worker Role', items: ['Applicant', 'Performer', 'Supervisor', 'Issuer', 'Receiver', 'Gas Tester', 'Fire Watch', 'Hole Watch', 'Standby Person'] },
];

@Injectable()
export class PtwService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.permitSetting.findUnique({ where: { companyId } });
    if (!s) s = await this.prisma.permitSetting.create({ data: { companyId } });
    return s;
  }

  async updateSettings(companyId: string, dto: UpdatePermitSettingsDto) {
    return this.prisma.permitSetting.upsert({ where: { companyId }, create: { companyId, ...dto }, update: dto });
  }

  async getPermitTypes(companyId: string) {
    return this.prisma.permitType.findMany({ where: { companyId, isActive: true }, orderBy: { sortOrder: 'asc' } });
  }

  async seedPermitTypes(companyId: string) {
    let count = 0;
    for (const pt of PERMIT_TYPES) {
      const existing = await this.prisma.permitType.findFirst({ where: { code: pt.code, companyId } });
      if (!existing) {
        await this.prisma.permitType.create({ data: { ...pt, companyId } });
        count++;
      }
    }
    return { seeded: count };
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
    for (const group of PTW_MASTER_DATA) {
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
    return { seeded: count, groups: PTW_MASTER_DATA.length };
  }

  // ─── Permit Type CRUD ──────────────────────────────────────────────────

  async createPermitType(data: any, companyId: string) {
    return this.prisma.permitType.create({ data: { ...data, companyId } });
  }

  async updatePermitType(id: string, data: any) {
    return this.prisma.permitType.update({ where: { id }, data });
  }

  async deletePermitType(id: string) {
    await this.prisma.permitType.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async addRequirement(permitTypeId: string, data: { requirement: string; isMandatory?: boolean; validationMode?: string }, companyId: string) {
    return this.prisma.permitTypeRequirement.create({ data: { permitTypeId, companyId, ...data } });
  }

  async getRequirements(permitTypeId: string) {
    return this.prisma.permitTypeRequirement.findMany({ where: { permitTypeId } });
  }

  async deleteRequirement(id: string) {
    await this.prisma.permitTypeRequirement.delete({ where: { id } });
    return { success: true };
  }
}
