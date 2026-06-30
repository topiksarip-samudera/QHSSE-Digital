import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSkillDto,
  UpdateSkillDto,
  ExecuteSkillDto,
  IncidentRcaSkillDto,
  RiskAssessmentSkillDto,
  JsaDraftSkillDto,
  PermitReviewSkillDto,
  ListSkillsQueryDto,
  ListSkillRunsQueryDto,
} from './dto/skill.dto';

@Injectable()
export class AISkillService {
  constructor(private prisma: PrismaService) {}

  // ─── Skill Management ───────────────────────────────────────────────────────

  async createSkill(companyId: string, userId: string, dto: CreateSkillDto) {
    const existing = await this.prisma.aISkill.findUnique({
      where: { skillKey: dto.skillKey },
    });

    if (existing) {
      throw new BadRequestException(`Skill with key ${dto.skillKey} already exists`);
    }

    return this.prisma.aISkill.create({
      data: {
        skillKey: dto.skillKey,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        moduleKey: dto.moduleKey,
        promptTemplate: dto.promptTemplate,
        systemPrompt: dto.systemPrompt,
        requiredPermissions: dto.requiredPermissions,
        isEnabled: dto.isEnabled,
        config: dto.config,
      },
    });
  }

  async listSkills(companyId: string, query: ListSkillsQueryDto) {
    const { page = 1, limit = 20, category, moduleKey, isEnabled, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { isEnabled: isEnabled ?? true };

    if (category) where.category = category;
    if (moduleKey) where.moduleKey = moduleKey;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [skills, total] = await Promise.all([
      this.prisma.aISkill.findMany({
        where,
        include: {
          _count: {
            select: { runs: true },
          },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.aISkill.count({ where }),
    ]);

    return {
      data: skills,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSkill(skillKey: string, companyId: string) {
    const skill = await this.prisma.aISkill.findUnique({
      where: { skillKey },
      include: {
        _count: {
          select: { runs: true },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async updateSkill(skillKey: string, companyId: string, dto: UpdateSkillDto) {
    await this.getSkill(skillKey, companyId);

    return this.prisma.aISkill.update({
      where: { skillKey },
      data: dto,
    });
  }

  async deleteSkill(skillKey: string, companyId: string) {
    await this.getSkill(skillKey, companyId);

    return this.prisma.aISkill.update({
      where: { skillKey },
      data: { isEnabled: false },
    });
  }

  // ─── Skill Execution ────────────────────────────────────────────────────────

  async executeSkill(companyId: string, userId: string, dto: ExecuteSkillDto) {
    const skill = await this.getSkill(dto.skillKey, companyId);

    if (!skill.isEnabled) {
      throw new BadRequestException('Skill is disabled');
    }

    // TODO: Check user permissions against skill.requiredPermissions

    // Create skill run record
    const run = await this.prisma.aISkillRun.create({
      data: {
        skillId: skill.id,
        companyId,
        userId,
        moduleKey: dto.moduleKey,
        recordId: dto.recordId,
        input: dto.input,
        status: 'pending',
      },
    });

    // Update run to running status
    await this.prisma.aISkillRun.update({
      where: { id: run.id },
      data: { status: 'running' },
    });

    try {
      // TODO: Implement actual AI skill execution
      // For now, create mock output
      const output = {
        result: `Mock output for skill: ${skill.name}`,
        confidence: 0.85,
        sources: [],
      };

      // Update run with success
      const completedRun = await this.prisma.aISkillRun.update({
        where: { id: run.id },
        data: {
          status: 'completed',
          output,
          model: dto.model || 'gpt-4',
          promptTokens: 500,
          completionTokens: 200,
          totalTokens: 700,
          cost: 0.014,
          latencyMs: 2000,
          completedAt: new Date(),
        },
      });

      return completedRun;
    } catch (error) {
      // Update run with failure
      await this.prisma.aISkillRun.update({
        where: { id: run.id },
        data: {
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  // ─── Skill Run History ──────────────────────────────────────────────────────

  async listSkillRuns(companyId: string, query: ListSkillRunsQueryDto) {
    const { page = 1, limit = 20, skillId, status, moduleKey } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (skillId) where.skillId = skillId;
    if (status) where.status = status;
    if (moduleKey) where.moduleKey = moduleKey;

    const [runs, total] = await Promise.all([
      this.prisma.aISkillRun.findMany({
        where,
        include: {
          skill: {
            select: { skillKey: true, name: true, category: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aISkillRun.count({ where }),
    ]);

    return {
      data: runs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSkillRun(runId: string, companyId: string) {
    const run = await this.prisma.aISkillRun.findUnique({
      where: { id: runId },
      include: {
        skill: true,
      },
    });

    if (!run || run.companyId !== companyId) {
      throw new NotFoundException('Skill run not found');
    }

    return run;
  }

  // ─── Specialized Skill Handlers ─────────────────────────────────────────────

  async executeIncidentRca(companyId: string, userId: string, dto: IncidentRcaSkillDto) {
    return this.executeSkill(companyId, userId, {
      skillKey: 'incident_rca',
      input: dto,
      moduleKey: 'incident',
      recordId: dto.incidentId,
    });
  }

  async executeRiskAssessment(companyId: string, userId: string, dto: RiskAssessmentSkillDto) {
    return this.executeSkill(companyId, userId, {
      skillKey: 'risk_assessment',
      input: dto,
      moduleKey: 'risk',
      recordId: dto.riskId,
    });
  }

  async executeJsaDraft(companyId: string, userId: string, dto: JsaDraftSkillDto) {
    return this.executeSkill(companyId, userId, {
      skillKey: 'jsa_draft',
      input: dto,
      moduleKey: 'risk',
    });
  }

  async executePermitReview(companyId: string, userId: string, dto: PermitReviewSkillDto) {
    return this.executeSkill(companyId, userId, {
      skillKey: 'permit_review',
      input: dto,
      moduleKey: 'ptw',
      recordId: dto.permitId,
    });
  }
}
