import { Controller, Post, Get, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';

@ApiTags('Risk - Residual & Action Plan') @ApiBearerAuth() @Controller('risks')
export class RiskActionController {
  constructor(private readonly svc: RiskService) {}

  @Post(':id/residual') @RequiredPermissions('risk.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Calculate residual risk' })
  async calculateResidual(@Param('id') id: string, @Body('residualSeverity') sev: number, @Body('residualLikelihood') lik: number, @Request() req: any) { return this.svc.calculateResidual(id, sev, lik, req.user.companyId, req.user.id); }

  @Get(':id/actions') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get actions linked to risk' })
  async getActionLinks(@Param('id') id: string, @Request() req: any) { return this.svc.getActionLinks(id, req.user.companyId); }

  @Post(':id/actions') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Link action to risk' })
  async createActionLink(@Param('id') id: string, @Body('actionId') actionId: string, @Body('actionType') actionType: string, @Request() req: any) { return this.svc.createActionLink(id, actionId, actionType, req.user.companyId); }

  @Delete(':id/actions/:linkId') @RequiredPermissions('risk.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Unlink action' })
  async deleteActionLink(@Param('id') id: string, @Param('linkId') linkId: string, @Request() req: any) { return this.svc.deleteActionLink(linkId, req.user.companyId); }
}
