import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAiSettingsDto, CreatePromptTemplateDto, CreateKnowledgeSourceDto, CreateOutputReviewDto, QueryDto } from './dto/ai-governance.dto';

@Injectable()
export class AiGovernanceService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string) {
    const s = await this.prisma.aiSetting.findUnique({ where: { companyId } });
    return s || { aiEnabled: false, allowedModules: [], allowedRoles: [], dataRedaction: true };
  }

  async updateSettings(companyId: string, dto: UpdateAiSettingsDto) {
    return this.prisma.aiSetting.upsert({
      where: { companyId },
      create: { companyId, aiEnabled: dto.aiEnabled ?? false, allowedModules: dto.allowedModules ?? [], allowedRoles: dto.allowedRoles ?? [], dataRedaction: dto.dataRedaction ?? true },
      update: { aiEnabled: dto.aiEnabled, allowedModules: dto.allowedModules, allowedRoles: dto.allowedRoles, dataRedaction: dto.dataRedaction },
    });
  }

  async createPromptTemplate(dto: CreatePromptTemplateDto, companyId: string, userId: string) {
    return this.prisma.aiPromptTemplate.create({ data: { companyId, name: dto.name, module: dto.module, prompt: dto.prompt, createdBy: userId } });
  }

  async getPromptTemplates(companyId: string, module?: string) {
    return this.prisma.aiPromptTemplate.findMany({ where: { companyId, isActive: true, ...(module ? { module } : {}) }, orderBy: { createdAt: 'desc' } });
  }

  async deletePromptTemplate(id: string) {
    await this.prisma.aiPromptTemplate.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async createKnowledgeSource(dto: CreateKnowledgeSourceDto, companyId: string, userId: string) {
    return this.prisma.aiKnowledgeSource.create({ data: { companyId, name: dto.name, type: dto.type || 'document', content: dto.content, sourceUrl: dto.sourceUrl, createdBy: userId } });
  }

  async getKnowledgeSources(companyId: string) {
    return this.prisma.aiKnowledgeSource.findMany({ where: { companyId, isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  async getUsageLogs(companyId: string, query: QueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.aiUsageLog.findMany({ where: { companyId }, include: { review: true }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.aiUsageLog.count({ where: { companyId } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createOutputReview(dto: CreateOutputReviewDto, companyId: string, userId: string) {
    return this.prisma.aiOutputReview.create({ data: { usageLogId: dto.usageLogId, reviewedBy: userId, rating: dto.rating || 0, notes: dto.notes, approved: dto.approved || false } });
  }

  async getProviderConfig(companyId: string) {
    const c = await this.prisma.aiProviderConfig.findFirst({ where: { companyId, isActive: true } });
    return c || { provider: 'openai', model: 'gpt-4', maxTokens: 4096, temperature: 0.7 };
  }

  async updateProviderConfig(companyId: string, dto: any) {
    return this.prisma.aiProviderConfig.upsert({
      where: { companyId },
      create: { companyId, ...dto },
      update: dto,
    });
  }
}
