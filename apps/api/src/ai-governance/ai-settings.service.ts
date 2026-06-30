import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateAISettingsDto,
  CreateFeatureToggleDto,
  UpdateFeatureToggleDto,
  CreateGuardrailPolicyDto,
  UpdateGuardrailPolicyDto,
  CreateRateLimitDto,
  UpdateRateLimitDto,
  UpdateAdminControlDto,
} from './dto/settings.dto';

@Injectable()
export class AISettingsService {
  constructor(private prisma: PrismaService) {}

  // ─── AI Settings ────────────────────────────────────────────────────────────

  async getSettings(companyId: string) {
    let settings = await this.prisma.aISettings.findUnique({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.aISettings.create({
        data: { companyId },
      });
    }

    return settings;
  }

  async updateSettings(companyId: string, dto: UpdateAISettingsDto) {
    return this.prisma.aISettings.upsert({
      where: { companyId },
      update: dto,
      create: { companyId, ...dto },
    });
  }

  // ─── Feature Toggles ────────────────────────────────────────────────────────

  async createFeatureToggle(companyId: string, dto: CreateFeatureToggleDto) {
    return this.prisma.aIFeatureToggle.create({
      data: { companyId, ...dto },
    });
  }

  async listFeatureToggles(companyId: string) {
    return this.prisma.aIFeatureToggle.findMany({
      where: { companyId },
      orderBy: { featureKey: 'asc' },
    });
  }

  async updateFeatureToggle(companyId: string, featureKey: string, dto: UpdateFeatureToggleDto) {
    return this.prisma.aIFeatureToggle.update({
      where: { companyId_featureKey: { companyId, featureKey } },
      data: dto,
    });
  }

  // ─── Guardrail Policies ─────────────────────────────────────────────────────

  async createGuardrailPolicy(companyId: string, userId: string, dto: CreateGuardrailPolicyDto) {
    return this.prisma.aIGuardrailPolicy.create({
      data: { companyId, createdBy: userId, ...dto },
    });
  }

  async listGuardrailPolicies(companyId: string) {
    return this.prisma.aIGuardrailPolicy.findMany({
      where: { companyId },
      include: { _count: { select: { events: true } } },
      orderBy: { policyKey: 'asc' },
    });
  }

  async updateGuardrailPolicy(companyId: string, policyKey: string, dto: UpdateGuardrailPolicyDto) {
    return this.prisma.aIGuardrailPolicy.update({
      where: { companyId_policyKey: { companyId, policyKey } },
      data: dto,
    });
  }

  // ─── Rate Limits ────────────────────────────────────────────────────────────

  async createRateLimit(companyId: string, dto: CreateRateLimitDto) {
    return this.prisma.aIRateLimit.create({
      data: { companyId, ...dto },
    });
  }

  async listRateLimits(companyId: string) {
    return this.prisma.aIRateLimit.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRateLimit(rateLimitId: string, companyId: string, dto: UpdateRateLimitDto) {
    return this.prisma.aIRateLimit.update({
      where: { id: rateLimitId },
      data: dto,
    });
  }

  async deleteRateLimit(rateLimitId: string, companyId: string) {
    return this.prisma.aIRateLimit.delete({
      where: { id: rateLimitId },
    });
  }

  // ─── Admin Controls ─────────────────────────────────────────────────────────

  async getAdminControls(companyId: string) {
    let controls = await this.prisma.aIAdminControl.findUnique({
      where: { companyId },
    });

    if (!controls) {
      controls = await this.prisma.aIAdminControl.create({
        data: {
          companyId,
          updatedBy: 'system',
          allowUserPrompts: true,
          allowDocumentUpload: true,
          allowModuleData: true,
          allowExport: true,
          requireApproval: false,
          blockedKeywords: [],
          allowedDomains: [],
        },
      });
    }

    return controls;
  }

  async updateAdminControls(companyId: string, userId: string, dto: UpdateAdminControlDto) {
    return this.prisma.aIAdminControl.upsert({
      where: { companyId },
      update: { ...dto, updatedBy: userId },
      create: { companyId, updatedBy: userId, ...dto },
    });
  }
}
