import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AdvancedPermissionService } from './advanced-permission.service';
import { CreateAccessPolicyDto, CreateTempAccessDto, PermissionSimulatorDto, PolicyQueryDto } from './dto/advanced-permission.dto';

@ApiTags('Advanced Permission') @ApiBearerAuth() @Controller()
export class AdvancedPermissionController {
  constructor(private readonly svc: AdvancedPermissionService) {}

  @Post('access-policies') @RequiredPermissions('advanced-permission.create') @ApiOperation({ summary: 'Create access policy' })
  async createPolicy(@Body() dto: CreateAccessPolicyDto, @Request() req: any) { return this.svc.createPolicy(dto, req.user.companyId, req.user.id); }

  @Get('access-policies') @RequiredPermissions('advanced-permission.view') @ApiOperation({ summary: 'List access policies' })
  async getPolicies(@Request() req: any, @Query() q: PolicyQueryDto) { return this.svc.getPolicies(req.user.companyId, q); }

  @Patch('access-policies/:id') @RequiredPermissions('advanced-permission.update') @ApiOperation({ summary: 'Update policy' })
  async updatePolicy(@Param('id') id: string, @Body() data: any, @Request() req: any) { return this.svc.updatePolicy(id, data, req.user.companyId); }

  @Delete('access-policies/:id') @RequiredPermissions('advanced-permission.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete policy' })
  async deletePolicy(@Param('id') id: string) { return this.svc.deletePolicy(id); }

  @Post('permission-simulator') @RequiredPermissions('advanced-permission.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Simulate user permissions' })
  async simulate(@Body() dto: PermissionSimulatorDto, @Request() req: any) { return this.svc.simulate(dto, req.user.companyId); }

  @Post('temporary-access') @RequiredPermissions('advanced-permission.create') @ApiOperation({ summary: 'Grant temporary access' })
  async createTempAccess(@Body() dto: CreateTempAccessDto, @Request() req: any) { return this.svc.createTempAccess(dto, req.user.companyId, req.user.id); }

  @Get('temporary-access') @RequiredPermissions('advanced-permission.view') @ApiOperation({ summary: 'List temporary access grants' })
  async getTempAccess(@Request() req: any) { return this.svc.getTempAccess(req.user.companyId); }

  @Delete('temporary-access/:id') @RequiredPermissions('advanced-permission.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Revoke temporary access' })
  async revokeTempAccess(@Param('id') id: string) { return this.svc.revokeTempAccess(id); }

  @Get('data-masking') @RequiredPermissions('advanced-permission.view') @ApiOperation({ summary: 'Get data masking rules' })
  async getDataMasking(@Request() req: any) { return this.svc.getDataMasking(req.user.companyId); }

  @Post('data-masking') @RequiredPermissions('advanced-permission.create') @ApiOperation({ summary: 'Create data masking rule' })
  async createDataMasking(@Body() data: any, @Request() req: any) { return this.svc.createDataMasking(req.user.companyId, data); }
}
