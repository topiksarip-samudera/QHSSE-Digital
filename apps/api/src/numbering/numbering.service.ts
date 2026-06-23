import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNumberingRuleDto, UpdateNumberingRuleDto, NumberingQueryDto, GenerateNumberDto } from './dto/numbering.dto';

@Injectable()
export class NumberingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNumberingRuleDto, companyId: string, userId: string) {
    const sample = this.buildSample(dto.prefix || '', dto.suffix || '', dto.digitCount || 5, dto.connector || '-');
    const rule = await this.prisma.numberingRule.create({
      data: { ...dto, companyId, sample, createdBy: userId },
    });
    await this.prisma.numberingCounter.create({ data: { ruleId: rule.id, companyId, moduleCode: dto.moduleCode, counter: 0 } });
    return rule;
  }

  async findAll(companyId: string, query: NumberingQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.moduleCode) where.moduleCode = query.moduleCode;
    if (query.search) where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }, { moduleCode: { contains: query.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.numberingRule.findMany({ where, include: { counters: { take: 1 } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.numberingRule.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, companyId: string) {
    const r = await this.prisma.numberingRule.findUnique({ where: { id }, include: { counters: true, histories: { orderBy: { createdAt: 'desc' }, take: 10 } } });
    if (!r) throw new NotFoundException('Not found');
    if (r.companyId !== companyId) throw new ForbiddenException('Access denied');
    return r;
  }

  async update(id: string, dto: UpdateNumberingRuleDto, companyId: string) {
    const r = await this.findOne(id, companyId);
    const prefix = dto.prefix ?? r.prefix; const suffix = dto.suffix ?? r.suffix; const digitCount = dto.digitCount ?? r.digitCount; const connector = dto.connector ?? r.connector;
    const sample = this.buildSample(prefix, suffix, digitCount, connector);
    return this.prisma.numberingRule.update({ where: { id }, data: { ...dto, sample } });
  }

  async softDelete(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.numberingRule.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return { success: true, id };
  }

  async preview(id: string, companyId: string) {
    const rule = await this.findOne(id, companyId);
    const counter = rule.counters[0];
    const nextNum = (counter?.counter || rule.nextNumber);
    const previewNum = this.buildSample(rule.prefix, rule.suffix, rule.digitCount, rule.connector, nextNum);
    return { sample: rule.sample, preview: previewNum, nextCounter: nextNum, resetBy: rule.resetBy };
  }

  async generateNumber(id: string, companyId: string, dto: GenerateNumberDto, userId: string) {
    const rule = await this.findOne(id, companyId);
    if (!rule.isActive) throw new BadRequestException('Rule is inactive');

    let resetKey: string | null = null;
    const now = new Date();
    if (rule.resetBy === 'year') resetKey = String(now.getFullYear());
    else if (rule.resetBy === 'month') resetKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    else if (rule.resetBy === 'year_month') resetKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let counter = await this.prisma.numberingCounter.findFirst({ where: { ruleId: id, resetKey } });
    if (!counter) {
      counter = await this.prisma.numberingCounter.create({ data: { ruleId: id, companyId, moduleCode: rule.moduleCode, resetKey, counter: 0 } });
    }
    const next = counter.counter + 1;
    const number = this.buildSample(rule.prefix, rule.suffix, rule.digitCount, rule.connector, next);
    await this.prisma.numberingCounter.update({ where: { id: counter.id }, data: { counter: next, lastNumber: number } });
    await this.prisma.numberingHistory.create({ data: { ruleId: id, companyId, generatedNumber: number, recordType: dto.recordType, recordId: dto.recordId, requestedBy: userId, counterValue: next, resetKey } });
    return { number, counter: next, rule: rule.name };
  }

  async resetCounter(ruleId: string, counterId: string, companyId: string) {
    await this.findOne(ruleId, companyId);
    await this.prisma.numberingCounter.update({ where: { id: counterId }, data: { counter: 0, lastNumber: null } });
    return { success: true };
  }

  private buildSample(prefix: string, suffix: string, digits: number, connector: string, num?: number): string {
    const numStr = String(num ?? 1).padStart(digits, '0');
    return [prefix, numStr, suffix].filter(Boolean).join(connector);
  }
}
