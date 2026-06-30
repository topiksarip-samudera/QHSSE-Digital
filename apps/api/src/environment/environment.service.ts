import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ENV_MASTER_DATA = [
  { group: 'Environment Record Type', items: ['Aspect Impact','Waste Manifest','Monitoring Result','Exceedance','Spill','Permit','Compliance'] },
  { group: 'Aspect Category', items: ['Air Emission','Wastewater','Domestic Wastewater','Hazardous Waste','Non-Hazardous Waste','Noise','Energy Consumption','Fuel Consumption','Water Consumption','Chemical Storage','Chemical Handling','Spill','Other'] },
  { group: 'Impact Category', items: ['Air Pollution','Water Pollution','Soil Contamination','Noise Pollution','Energy Waste','Resource Depletion','Regulatory Non-Compliance','Reputation','Health Impact','Other'] },
  { group: 'Waste Type', items: ['Hazardous (B3)','Non-Hazardous','Medical Waste','Electronic Waste','Construction Waste','Organic','Other'] },
  { group: 'Waste Category', items: ['Scheduled Waste','Non-Scheduled Waste','Controlled Waste','Industrial Waste','Commercial Waste'] },
  { group: 'Permit Type', items: ['Environmental Permit','Wastewater Discharge','Air Emission','Landfill','Noise','Hazardous Waste','Fuel Storage','Chemical Storage'] },
  { group: 'Exceedance Level', items: ['Low','Medium','High','Critical'] },
  { group: 'Spill Severity', items: ['Minor','Moderate','Major','Critical'] },
  { group: 'Energy Type', items: ['Electricity','Natural Gas','Propane','Solar','Wind','Other'] },
  { group: 'Fuel Type', items: ['Diesel','Petrol','LPG','CNG','Biodiesel','Other'] },
  { group: 'Chemical Type', items: ['Acid','Base','Solvent','Paint','Adhesive','Cleaning Agent','Reactive','Corrosive'] },
  { group: 'Resource Type', items: ['Water','Fuel','Energy','Chemical','Raw Material','Other'] },
  { group: 'Monitoring Type', items: ['Routine','Quarterly','Bi-Annually','Annually','Event-Based','Emergency'] },
  { group: 'Parameter Group', items: ['Air Quality','Wastewater Quality','Noise Level','Soil Quality','Noise Emission'] },
  { group: 'Parameter Unit', items: ['mg/Nm³','µg/m³','dBA','ppm','mg/L','°C','mL','kg','m³','hours'] },
  { group: 'Permit Status', items: ['Active','Expired','Pending','Suspended','Revoked','Cancelled'] },
];

@Injectable()
export class EnvironmentService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.environmentSetting.findUnique({ where: { companyId } });
    if (!s) s = await this.prisma.environmentSetting.create({ data: { companyId } });
    return s;
  }

  async updateSettings(companyId: string, dto: any) {
    return this.prisma.environmentSetting.upsert({ where: { companyId }, create: { companyId, ...dto }, update: dto });
  }

  async getMasterData(companyId: string) {
    return this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] }, include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } }, orderBy: { name: 'asc' },
    });
  }

  async seedDefaults(companyId: string) {
    let count = 0;
    for (const group of ENV_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), companyId } });
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) { await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\s\/]+/g, '_'), sortOrder: i, companyId } }); count++; }
      }
    }
    return { seeded: count, groups: ENV_MASTER_DATA.length };
  }
}
