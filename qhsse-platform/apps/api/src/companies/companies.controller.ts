import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { UpdateCompanySettingsDto, BulkUpdateSettingsDto } from './dto/update-company-settings.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AuditModule } from '../common/decorators/audit-module.decorator';
import { Status } from '@prisma/client';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // ─── GET /companies ─────────────────────────────────────────────────────
  @Get()
  @RequiredPermissions('company.view')
  @AuditModule('company')
  @ApiOperation({ summary: 'List all companies with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of companies' })
  async findAll(
    @Query() query: QueryCompanyDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.findAll(query, userId, isSuperAdmin);
  }

  // ─── GET /companies/:id ─────────────────────────────────────────────────
  @Get(':id')
  @RequiredPermissions('company.view')
  @AuditModule('company')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company details' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.findOne(id, userId, isSuperAdmin);
  }

  // ─── POST /companies ────────────────────────────────────────────────────
  @Post()
  @RequiredPermissions('company.create')
  @AuditModule('company')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created' })
  @ApiResponse({ status: 409, description: 'Company code already exists' })
  async create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.companiesService.create(dto, userId);
  }

  // ─── PATCH /companies/:id ───────────────────────────────────────────────
  @Patch(':id')
  @RequiredPermissions('company.update')
  @AuditModule('company')
  @ApiOperation({ summary: 'Update company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.update(id, dto, userId, isSuperAdmin);
  }

  // ─── PATCH /companies/:id/status ────────────────────────────────────────
  @Patch(':id/status')
  @RequiredPermissions('company.update')
  @AuditModule('company')
  @ApiOperation({ summary: 'Update company status (suspend/activate)' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.updateStatus(id, status, userId, isSuperAdmin);
  }

  // ─── DELETE /companies/:id ──────────────────────────────────────────────
  @Delete(':id')
  @RequiredPermissions('company.delete')
  @AuditModule('company')
  @ApiOperation({ summary: 'Soft delete company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.remove(id, userId, isSuperAdmin);
  }

  // ─── GET /companies/:id/settings ────────────────────────────────────────
  @Get(':id/settings')
  @RequiredPermissions('company.view')
  @AuditModule('company')
  @ApiOperation({ summary: 'Get company settings' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  async getSettings(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.getSettings(id, userId, isSuperAdmin);
  }

  // ─── PATCH /companies/:id/settings ──────────────────────────────────────
  @Patch(':id/settings')
  @RequiredPermissions('company.update')
  @AuditModule('company')
  @ApiOperation({ summary: 'Update company setting' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  async updateSetting(
    @Param('id') id: string,
    @Body() dto: UpdateCompanySettingsDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.updateSetting(id, dto.key, dto.value, dto.description, userId, isSuperAdmin);
  }

  // ─── POST /companies/:id/settings/bulk ──────────────────────────────────
  @Post(':id/settings/bulk')
  @RequiredPermissions('company.update')
  @AuditModule('company')
  @ApiOperation({ summary: 'Bulk update company settings' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  async bulkUpdateSettings(
    @Param('id') id: string,
    @Body() dto: BulkUpdateSettingsDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.bulkUpdateSettings(id, dto.settings, userId, isSuperAdmin);
  }

  // ─── GET /companies/:id/stats ───────────────────────────────────────────
  @Get(':id/stats')
  @RequiredPermissions('company.view')
  @AuditModule('company')
  @ApiOperation({ summary: 'Get company statistics' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  async getStats(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.companiesService.getStats(id, userId, isSuperAdmin);
  }
}
