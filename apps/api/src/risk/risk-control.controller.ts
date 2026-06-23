import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';

@ApiTags('Risk - Control Management') @ApiBearerAuth() @Controller('risk')
export class RiskControlController {
  constructor(private readonly svc: RiskService) {}

  @Get('controls') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get controls' })
  async getControls(@Request() req: any, @Query('riskId') riskId?: string) { return this.svc.getControls(req.user.companyId, riskId); }

  @Post('controls') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create control' })
  async createControl(@Body() d: any, @Request() req: any) { return this.svc.createControl(d, req.user.companyId); }

  @Patch('controls/:id') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Update control' })
  async updateControl(@Param('id') id: string, @Body() d: any) { return this.svc.updateControl(id, d); }

  @Delete('controls/:id') @RequiredPermissions('risk.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Retire control' })
  async deleteControl(@Param('id') id: string) { return this.svc.deleteControl(id); }

  @Post('controls/:id/effectiveness') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add effectiveness review' })
  async addEffectiveness(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addEffectiveness(id, d, req.user.companyId); }

  @Get('controls/:id/effectiveness') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get effectiveness history' })
  async getEffectiveness(@Param('id') id: string) { return this.svc.getEffectiveness(id); }

  @Post('controls/:id/verifications') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add critical control verification' })
  async addVerification(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addVerification(id, d, req.user.companyId); }

  @Get('controls/:id/verifications') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get verification history' })
  async getVerifications(@Param('id') id: string) { return this.svc.getVerifications(id); }
}
