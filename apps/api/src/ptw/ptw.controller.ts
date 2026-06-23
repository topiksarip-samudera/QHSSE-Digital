import { Controller, Get, Post, Patch, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { PtwService } from './ptw.service';
import { UpdatePermitSettingsDto } from './dto/ptw-settings.dto';

@ApiTags('Permit to Work') @ApiBearerAuth() @Controller('ptw')
export class PtwController {
  constructor(private readonly svc: PtwService) {}

  @Get('settings') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get PTW settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }
  @Patch('settings') @RequiredPermissions('ptw.manage_settings') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() dto: UpdatePermitSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('permit-types') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get permit types' })
  async getPermitTypes(@Request() req: any) { return this.svc.getPermitTypes(req.user.companyId); }
  @Post('permit-types/seed') @RequiredPermissions('ptw.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default permit types' })
  async seedPermitTypes(@Request() req: any) { return this.svc.seedPermitTypes(req.user.companyId); }

  @Get('master-data') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get PTW master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }
  @Post('master-data/seed-defaults') @RequiredPermissions('ptw.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }

  // Permit Type CRUD
  @Post('permit-types/create') @RequiredPermissions('ptw.manage_settings') @ApiOperation({ summary: 'Create permit type' })
  async createPermitType(@Body() d: any, @Request() req: any) { return this.svc.createPermitType(d, req.user.companyId); }
  @Patch('permit-types/:id') @RequiredPermissions('ptw.manage_settings') @ApiOperation({ summary: 'Update permit type' })
  async updatePermitType(@Param('id') id: string, @Body() d: any) { return this.svc.updatePermitType(id, d); }
  @Delete('permit-types/:id') @RequiredPermissions('ptw.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete permit type' })
  async deletePermitType(@Param('id') id: string) { return this.svc.deletePermitType(id); }

  // Requirements
  @Post('permit-types/:id/requirements') @RequiredPermissions('ptw.manage_settings') @ApiOperation({ summary: 'Add requirement to permit type' })
  async addRequirement(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addRequirement(id, d, req.user.companyId); }
  @Get('permit-types/:id/requirements') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get requirements' })
  async getRequirements(@Param('id') id: string) { return this.svc.getRequirements(id); }
  @Delete('permit-types/:id/requirements/:reqId') @RequiredPermissions('ptw.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete requirement' })
  async deleteRequirement(@Param('id') id: string, @Param('reqId') reqId: string) { return this.svc.deleteRequirement(reqId); }
}
