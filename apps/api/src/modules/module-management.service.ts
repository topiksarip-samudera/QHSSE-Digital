import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { ToggleModuleDto } from './dto/toggle-module.dto';
import { ToggleFeatureDto } from './dto/toggle-feature.dto';
import { QueryModulesDto } from './dto/query-modules.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModuleManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ═════════════════════════════════════════════════════════════════════════
  // MODULES
  // ═════════════════════════════════════════════════════════════════════════

  async findAllModules(query: QueryModulesDto) {
    const { page = 1, pageSize = 50, search, status, sort = 'sortOrder', order = 'asc' } = query;

    const where: Prisma.ModuleWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [items, total] = await Promise.all([
      this.prisma.module.findMany({
        where,
        include: {
          features: {
            orderBy: { createdAt: 'asc' as const },
          },
          _count: { select: { tenantModules: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.module.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOneModule(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { createdAt: 'asc' as const },
        },
        tenantModules: {
          include: {
            tenant: { select: { id: true, name: true, slug: true } },
          },
        },
        roleModuleAccess: {
          include: {
            role: { select: { id: true, name: true, code: true } },
            tenant: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }

    return module;
  }

  async findModuleByCode(code: string) {
    const module = await this.prisma.module.findUnique({
      where: { code },
      include: {
        features: true,
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with code "${code}" not found`);
    }

    return module;
  }

  async createModule(dto: CreateModuleDto) {
    const existing = await this.prisma.module.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Module with code "${dto.code}" already exists`);
    }

    return this.prisma.module.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        icon: dto.icon,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { features: true },
    });
  }

  async updateModule(id: string, dto: UpdateModuleDto, userId: string) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: { features: true },
    });
  }

  async deleteModule(id: string, userId: string) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }

    // Check if module has tenant assignments
    const tenantCount = await this.prisma.tenantModule.count({
      where: { moduleId: id, isEnabled: true },
    });

    if (tenantCount > 0) {
      throw new ForbiddenException(
        `Cannot delete module "${existing.name}" — it is currently enabled for ${tenantCount} tenant(s). Disable it first.`,
      );
    }

    return this.prisma.module.delete({ where: { id } });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // FEATURES
  // ═════════════════════════════════════════════════════════════════════════

  async createFeature(moduleId: string, dto: CreateFeatureDto) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    const existing = await this.prisma.moduleFeature.findUnique({
      where: { moduleId_code: { moduleId, code: dto.code } },
    });

    if (existing) {
      throw new ConflictException(
        `Feature with code "${dto.code}" already exists in module "${module.name}"`,
      );
    }

    return this.prisma.moduleFeature.create({
      data: {
        moduleId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateFeature(featureId: string, data: { name?: string; description?: string; isActive?: boolean }) {
    const feature = await this.prisma.moduleFeature.findUnique({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID "${featureId}" not found`);
    }

    return this.prisma.moduleFeature.update({
      where: { id: featureId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async deleteFeature(featureId: string) {
    const feature = await this.prisma.moduleFeature.findUnique({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID "${featureId}" not found`);
    }

    return this.prisma.moduleFeature.delete({ where: { id: featureId } });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TENANT MODULE TOGGLE
  // ═════════════════════════════════════════════════════════════════════════

  async getTenantModules(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
    }

    const allModules = await this.prisma.module.findMany({
      where: { isActive: true },
      include: {
        features: { where: { isActive: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const tenantModules = await this.prisma.tenantModule.findMany({
      where: { tenantId },
    });

    const featureFlags = await this.prisma.tenantFeatureFlag.findMany({
      where: { tenantId },
    });

    const tenantModuleMap = new Map(tenantModules.map((tm) => [tm.moduleId, tm]));
    const featureFlagMap = new Map(featureFlags.map((ff) => [ff.featureId, ff]));

    return allModules.map((module) => {
      const tm = tenantModuleMap.get(module.id);
      return {
        ...module,
        isEnabled: tm?.isEnabled ?? false,
        config: tm?.config ?? null,
        enabledAt: tm?.enabledAt ?? null,
        disabledAt: tm?.disabledAt ?? null,
        features: module.features.map((f) => {
          const ff = featureFlagMap.get(f.id);
          return {
            ...f,
            isEnabled: ff?.isEnabled ?? true,
            config: ff?.config ?? null,
          };
        }),
      };
    });
  }

  async toggleTenantModule(tenantId: string, moduleId: string, dto: ToggleModuleDto, userId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
    }

    const data: any = {
      isEnabled: dto.isEnabled,
      config: dto.config,
    };

    if (dto.isEnabled) {
      data.enabledAt = new Date();
      data.disabledAt = null;
    } else {
      data.disabledAt = new Date();
    }

    return this.prisma.tenantModule.upsert({
      where: { tenantId_moduleId: { tenantId, moduleId } },
      update: data,
      create: {
        tenantId,
        moduleId,
        ...data,
      },
      include: { module: true, tenant: { select: { id: true, name: true } } },
    });
  }

  async toggleTenantFeature(
    tenantId: string,
    featureId: string,
    dto: ToggleFeatureDto,
    userId: string,
  ) {
    const feature = await this.prisma.moduleFeature.findUnique({
      where: { id: featureId },
      include: { module: true },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID "${featureId}" not found`);
    }

    // Verify module is enabled for tenant
    const tenantModule = await this.prisma.tenantModule.findUnique({
      where: { tenantId_moduleId: { tenantId, moduleId: feature.moduleId } },
    });

    if (!tenantModule || !tenantModule.isEnabled) {
      throw new BadRequestException(
        `Cannot toggle feature — module "${feature.module.name}" is not enabled for this tenant`,
      );
    }

    const data: any = {
      isEnabled: dto.isEnabled,
      config: dto.config,
    };

    if (dto.isEnabled) {
      data.enabledAt = new Date();
      data.disabledAt = null;
    } else {
      data.disabledAt = new Date();
    }

    return this.prisma.tenantFeatureFlag.upsert({
      where: { tenantId_featureId: { tenantId, featureId } },
      update: data,
      create: {
        tenantId,
        featureId,
        ...data,
      },
      include: { feature: true },
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ROLE MODULE ACCESS
  // ═════════════════════════════════════════════════════════════════════════

  async getRoleModuleAccess(tenantId: string, roleId: string) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    const allModules = await this.prisma.module.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    const accessRecords = await this.prisma.roleModuleAccess.findMany({
      where: { tenantId, roleId },
    });

    const accessMap = new Map(accessRecords.map((r) => [r.moduleId, r.canAccess]));

    return allModules.map((module) => ({
      moduleId: module.id,
      moduleName: module.name,
      moduleCode: module.code,
      moduleIcon: module.icon,
      canAccess: accessMap.get(module.id) ?? false,
    }));
  }

  async setRoleModuleAccess(
    tenantId: string,
    roleId: string,
    moduleId: string,
    canAccess: boolean,
  ) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    return this.prisma.roleModuleAccess.upsert({
      where: {
        roleId_moduleId_tenantId: { roleId, moduleId, tenantId },
      },
      update: { canAccess },
      create: { roleId, moduleId, tenantId, canAccess },
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // BULK OPERATIONS
  // ═════════════════════════════════════════════════════════════════════════

  async bulkToggleTenantModules(
    tenantId: string,
    moduleIds: string[],
    isEnabled: boolean,
    userId: string,
  ) {
    const results = [];
    for (const moduleId of moduleIds) {
      try {
        const result = await this.toggleTenantModule(tenantId, moduleId, { isEnabled }, userId);
        results.push({ moduleId, success: true, isEnabled: result.isEnabled });
      } catch (error: any) {
        results.push({ moduleId, success: false, error: error.message });
      }
    }
    return results;
  }
}
