import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DOC_MASTER_DATA = [
  { group: 'Document Type', items: ['Policy','Manual','SOP','Work Instruction','Form','Checklist','Standard','Guideline','Emergency Procedure','HSE Plan','Quality Plan','Method Statement','Legal Document','Training Material','External Standard','Drawing'] },
  { group: 'Document Category', items: ['QHSSE','Quality','Health','Safety','Security','Environment','Engineering','Operations','HR','Finance','Legal','Compliance','Technical','Management'] },
  { group: 'Document Status', items: ['Draft','Under Review','Approved','Published','Obsolete','Archived','Cancelled'] },
  { group: 'Confidentiality Level', items: ['Public','Internal','Confidential','Restricted','Secret'] },
  { group: 'Distribution Type', items: ['Controlled Copy','Uncontrolled Copy','Electronic','Hard Copy','Display Only'] },
  { group: 'Review Frequency', items: ['Monthly','Quarterly','Bi-Annually','Annually','Every 2 Years','Every 3 Years','Event-Based'] },
];

@Injectable()
export class DocumentControlService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    let s = await this.prisma.documentSetting.findUnique({ where: { companyId } });
    if (!s) s = await this.prisma.documentSetting.create({ data: { companyId } });
    return s;
  }

  async updateSettings(companyId: string, dto: any) {
    return this.prisma.documentSetting.upsert({ where: { companyId }, create: { companyId, ...dto }, update: dto });
  }

  async getMasterData(companyId: string) {
    return this.prisma.masterDataGroup.findMany({
      where: { OR: [{ companyId }, { companyId: null }] }, include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } }, orderBy: { name: 'asc' },
    });
  }

  async seedDefaults(companyId: string) {
    let count = 0;
    for (const group of DOC_MASTER_DATA) {
      let mg = await this.prisma.masterDataGroup.findFirst({ where: { name: group.group, companyId } });
      if (!mg) mg = await this.prisma.masterDataGroup.create({ data: { name: group.group, code: group.group.toLowerCase().replace(/\s+/g, '_'), companyId } });
      for (let i = 0; i < group.items.length; i++) {
        const existing = await this.prisma.masterDataItem.findFirst({ where: { groupId: mg.id, name: group.items[i] } });
        if (!existing) { await this.prisma.masterDataItem.create({ data: { groupId: mg.id, name: group.items[i], code: group.items[i].toLowerCase().replace(/[\s\/]+/g, '_'), sortOrder: i, companyId } }); count++; }
      }
    }
    return { seeded: count, groups: DOC_MASTER_DATA.length };
  }
}
