import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateChecklistDto, UpdateChecklistDto, ChecklistQueryDto, SubmitChecklistDto } from './dto/checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChecklistDto, companyId: string, userId: string) {
    const checklist = await this.prisma.checklist.create({
      data: { companyId, name: dto.name, description: dto.description, passScore: dto.passScore, createdBy: userId, status: Status.draft },
    });
    if (dto.sections) await this.createSections(checklist.id, dto.sections);
    return this.getDetail(checklist.id, companyId);
  }

  async findAll(companyId: string, query: ChecklistQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.search) where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.checklist.findMany({ where, include: { _count: { select: { sections: true, responses: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.checklist.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getDetail(id: string, companyId: string) {
    const c = await this.prisma.checklist.findUnique({
      where: { id },
      include: {
        sections: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' }, include: { items: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' }, include: { options: { orderBy: { sortOrder: 'asc' } } } } } },
        versions: { orderBy: { version: 'desc' }, take: 5 },
      },
    });
    if (!c) throw new NotFoundException('Not found');
    if (c.companyId !== companyId) throw new ForbiddenException('Access denied');
    return c;
  }

  async update(id: string, dto: UpdateChecklistDto, companyId: string, userId: string) {
    const c = await this.getDetail(id, companyId);
    if (c.status === Status.active) throw new BadRequestException('Cannot edit published checklist');
    const maxScore = this.calcMaxScore(dto.sections || []);
    await this.prisma.checklist.update({
      where: { id },
      data: { name: dto.name ?? c.name, description: dto.description !== undefined ? dto.description : c.description, passScore: dto.passScore ?? c.passScore, maxScore },
    });
    if (dto.sections) {
      await this.prisma.checklistSection.updateMany({ where: { checklistId: id }, data: { deletedAt: new Date() } });
      await this.createSections(id, dto.sections);
    }
    return this.getDetail(id, companyId);
  }

  async softDelete(id: string, companyId: string) {
    await this.getDetail(id, companyId);
    await this.prisma.checklist.update({ where: { id }, data: { deletedAt: new Date(), status: Status.archived } });
    return { success: true, id };
  }

  async publish(id: string, companyId: string, userId: string) {
    const c = await this.getDetail(id, companyId);
    if (c.status === Status.active) throw new BadRequestException('Already published');
    const definition = { sections: c.sections.map((s: any) => ({ title: s.title, description: s.description, sortOrder: s.sortOrder, items: s.items.map((it: any) => ({ question: it.question, description: it.description, answerType: it.answerType, required: it.required, weight: it.weight, critical: it.critical, requireEvidence: it.requireEvidence, requireComment: it.requireComment, autoFinding: it.autoFinding, findingAction: it.findingAction, sortOrder: it.sortOrder, options: it.options.map((o: any) => ({ label: o.label, value: o.value, score: o.score, isPass: o.isPass, sortOrder: o.sortOrder })) })) })) };
    const newVersion = c.version + 1;
    await this.prisma.checklistVersion.create({ data: { checklistId: id, companyId, version: newVersion, definition, status: Status.active, publishedBy: userId, publishedAt: new Date() } });
    await this.prisma.checklist.update({ where: { id }, data: { status: Status.active, version: newVersion } });
    return this.getDetail(id, companyId);
  }

  async submit(dto: SubmitChecklistDto, companyId: string, userId: string) {
    const version = await this.prisma.checklistVersion.findUnique({ where: { id: dto.checklistVersionId } });
    if (!version) throw new NotFoundException('Version not found');
    const def = version.definition as any;
    let totalScore = 0; let maxScore = 0; const responseItems: any[] = [];
    for (const itemDto of dto.items) {
      let foundItem: any = null;
      for (const sec of def.sections || []) { const it = (sec.items || []).find((i: any) => i.question === itemDto.itemId || i.sortOrder === Number(itemDto.itemId)); if (it) { foundItem = it; break; } }
      if (!foundItem) continue;
      const opt = foundItem.options?.find((o: any) => o.value === itemDto.answer);
      const score = opt ? opt.score : (foundItem.answerType === 'yes_no' && itemDto.answer === 'yes' ? foundItem.weight : (foundItem.answerType === 'pass_fail' && itemDto.answer === 'pass' ? foundItem.weight : 0));
      const isCriticalFail = foundItem.critical && (opt ? !opt.isPass : (foundItem.answerType === 'yes_no' ? itemDto.answer !== 'yes' : foundItem.answerType === 'pass_fail' ? itemDto.answer !== 'pass' : false));
      totalScore += score || 0; maxScore += foundItem.weight || 1;
      responseItems.push({ itemId: itemDto.itemId, answer: itemDto.answer, score, evidenceId: itemDto.evidenceId, comment: itemDto.comment, isCriticalFail });
    }
    const checklist = await this.prisma.checklist.findUnique({ where: { id: version.checklistId } });
    const passScore = checklist?.passScore || 0;
    const passed = passScore > 0 ? totalScore >= passScore : null;
    const response = await this.prisma.checklistResponse.create({
      data: { checklistId: version.checklistId, checklistVersionId: dto.checklistVersionId, companyId, submittedBy: userId, status: Status.submitted, totalScore, maxScore, passScore, passed },
    });
    for (const ri of responseItems) {
      await this.prisma.checklistResponseItem.create({
        data: { responseId: response.id, itemId: ri.itemId, answer: ri.answer, score: ri.score, evidenceId: ri.evidenceId, comment: ri.comment, isCriticalFail: ri.isCriticalFail },
      });
    }
    return { id: response.id, totalScore, maxScore, passScore, passed, criticalFails: responseItems.filter((r: any) => r.isCriticalFail).length };
  }

  async getResponses(checklistId: string, companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.checklistResponse.findMany({ where: { checklistId, companyId, deletedAt: null }, include: { items: true, version: { select: { version: true } } }, orderBy: { submittedAt: 'desc' }, skip, take: limit }),
      this.prisma.checklistResponse.count({ where: { checklistId, companyId, deletedAt: null } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getResponseDetail(id: string, companyId: string) {
    const r = await this.prisma.checklistResponse.findUnique({ where: { id }, include: { items: true, version: true } });
    if (!r) throw new NotFoundException('Not found');
    if (r.companyId !== companyId) throw new ForbiddenException('Access denied');
    return r;
  }

  private async createSections(checklistId: string, sections: any[]) {
    for (let si = 0; si < sections.length; si++) {
      const s = sections[si];
      const section = await this.prisma.checklistSection.create({ data: { checklistId, title: s.title, description: s.description, sortOrder: s.sortOrder ?? si } });
      if (s.items) {
        for (let ii = 0; ii < s.items.length; ii++) {
          const it = s.items[ii];
          const item = await this.prisma.checklistItem.create({
            data: { sectionId: section.id, question: it.question, description: it.description, answerType: it.answerType, required: it.required ?? false, weight: it.weight ?? 1, critical: it.critical ?? false, requireEvidence: it.requireEvidence ?? false, requireComment: it.requireComment ?? false, autoFinding: it.autoFinding ?? false, findingAction: it.findingAction, sortOrder: it.sortOrder ?? ii },
          });
          if (it.options) {
            for (let oi = 0; oi < it.options.length; oi++) {
              const o = it.options[oi];
              await this.prisma.checklistAnswerOption.create({ data: { itemId: item.id, label: o.label, value: o.value, score: o.score ?? 0, isPass: o.isPass ?? true, sortOrder: o.sortOrder ?? oi } });
            }
          }
        }
      }
    }
  }

  private calcMaxScore(sections: any[]): number {
    let max = 0;
    for (const s of sections) {
      for (const it of s.items || []) {
        if (it.options && it.options.length > 0) {
          max += Math.max(...it.options.map((o: any) => o.score || 0));
        } else {
          max += it.weight || 1;
        }
      }
    }
    return max;
  }
}
