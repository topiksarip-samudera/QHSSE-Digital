import { Controller, Get, Post, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';

@ApiTags('Risk - Cross Module') @ApiBearerAuth() @Controller('risks')
export class RiskLinkController {
  constructor(private readonly svc: RiskService) {}

  @Get(':id/links') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get linked items for risk' })
  async getLinks(@Param('id') id: string, @Request() req: any) { return this.svc.getLinkedItems(id, req.user.companyId); }

  @Post(':id/links') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Link risk to another module record' })
  async createLink(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.createLink(id, d, req.user.companyId); }

  @Delete(':id/links/:linkId') @RequiredPermissions('risk.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Unlink cross-module reference' })
  async deleteLink(@Param('id') id: string, @Param('linkId') linkId: string, @Request() req: any) { return this.svc.deleteLink(linkId, req.user.companyId); }

  @Get(':id/cross-module') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get comprehensive cross-module view' })
  async crossModuleView(@Param('id') id: string, @Request() req: any) { return this.svc.getRiskCrossModuleView(id, req.user.companyId); }
}
