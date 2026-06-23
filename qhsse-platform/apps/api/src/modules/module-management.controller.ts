import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModuleManagementService } from './module-management.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { ToggleModuleDto } from './dto/toggle-module.dto';
import { ToggleFeatureDto } from './dto/toggle-feature.dto';
import { QueryModulesDto } from './dto/query-modules.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Module Management')
@ApiBearerAuth()
@Controller('modules')
export class ModuleManagementController {
  constructor(private readonly service: ModuleManagementService) {}

  // ─── MODULES ─────────────────────────────────────────────────────────────

  @Get()
  @RequiredPermissions('module.view')
  @ApiOperation({ summary: 'List all system modules' })
  async findAll(@Query() query: QueryModulesDto) {
    return this.service.findAllModules(query);
  }

  @Get(':id')
  @RequiredPermissions('module.view')
  @ApiOperation({ summary: 'Get module by ID with features' })
  async findOne(@Param('id') id: string) {
    return this.service.findOneModule(id);
  }

  @Get('code/:code')
  @RequiredPermissions('module.view')
  @ApiOperation({ summary: 'Get module by code' })
  async findByCode(@Param('code') code: string) {
    return this.service.findModuleByCode(code);
  }

  @Post()
  @RequiredPermissions('module.create')
  @ApiOperation({ summary: 'Create a new module' })
  async create(@Body() dto: CreateModuleDto, @CurrentUser() user: any) {
    return this.service.createModule(dto);
  }

  @Patch(':id')
  @RequiredPermissions('module.update')
  @ApiOperation({ summary: 'Update a module' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.service.updateModule(id, dto, user.sub);
  }

  @Delete(':id')
  @RequiredPermissions('module.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a module' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.deleteModule(id, user.sub);
  }

  // ─── FEATURES ────────────────────────────────────────────────────────────

  @Post(':id/features')
  @RequiredPermissions('module.create')
  @ApiOperation({ summary: 'Add a feature to a module' })
  async createFeature(
    @Param('id') moduleId: string,
    @Body() dto: CreateFeatureDto,
  ) {
    return this.service.createFeature(moduleId, dto);
  }

  @Patch('features/:featureId')
  @RequiredPermissions('module.update')
  @ApiOperation({ summary: 'Update a feature' })
  async updateFeature(
    @Param('featureId') featureId: string,
    @Body() dto: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.service.updateFeature(featureId, dto);
  }

  @Delete('features/:featureId')
  @RequiredPermissions('module.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a feature' })
  async deleteFeature(@Param('featureId') featureId: string) {
    return this.service.deleteFeature(featureId);
  }

  // ─── TENANT MODULE MANAGEMENT ────────────────────────────────────────────

  @Get('tenant/:tenantId')
  @RequiredPermissions('module.view')
  @ApiOperation({ summary: 'Get all modules for a tenant with enable/disable status' })
  async getTenantModules(@Param('tenantId') tenantId: string) {
    return this.service.getTenantModules(tenantId);
  }

  @Patch('tenant/:tenantId/:moduleId')
  @RequiredPermissions('module.update')
  @ApiOperation({ summary: 'Enable or disable a module for a tenant' })
  async toggleTenantModule(
    @Param('tenantId') tenantId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: ToggleModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.service.toggleTenantModule(tenantId, moduleId, dto, user.sub);
  }

  @Post('tenant/:tenantId/bulk-toggle')
  @RequiredPermissions('module.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk enable or disable modules for a tenant' })
  async bulkToggleTenantModules(
    @Param('tenantId') tenantId: string,
    @Body() dto: { moduleIds: string[]; isEnabled: boolean },
    @CurrentUser() user: any,
  ) {
    return this.service.bulkToggleTenantModules(tenantId, dto.moduleIds, dto.isEnabled, user.sub);
  }

  // ─── TENANT FEATURE FLAGS ───────────────────────────────────────────────

  @Patch('tenant/:tenantId/features/:featureId')
  @RequiredPermissions('module.update')
  @ApiOperation({ summary: 'Enable or disable a feature for a tenant' })
  async toggleTenantFeature(
    @Param('tenantId') tenantId: string,
    @Param('featureId') featureId: string,
    @Body() dto: ToggleFeatureDto,
    @CurrentUser() user: any,
  ) {
    return this.service.toggleTenantFeature(tenantId, featureId, dto, user.sub);
  }

  // ─── ROLE MODULE ACCESS ──────────────────────────────────────────────────

  @Get('access/:tenantId/role/:roleId')
  @RequiredPermissions('module.view')
  @ApiOperation({ summary: 'Get module access for a role' })
  async getRoleModuleAccess(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.service.getRoleModuleAccess(tenantId, roleId);
  }

  @Patch('access/:tenantId/role/:roleId/:moduleId')
  @RequiredPermissions('module.update')
  @ApiOperation({ summary: 'Set module access for a role' })
  async setRoleModuleAccess(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: { canAccess: boolean },
  ) {
    return this.service.setRoleModuleAccess(tenantId, roleId, moduleId, dto.canAccess);
  }
}
