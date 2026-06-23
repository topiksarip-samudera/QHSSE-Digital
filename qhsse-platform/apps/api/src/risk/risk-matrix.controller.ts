import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';
import { UpdateMatrixDto, PreviewScoreDto } from './dto/matrix.dto';

@ApiTags('Risk - Matrix Engine') @ApiBearerAuth() @Controller('risk')
export class RiskMatrixController {
  constructor(private readonly svc: RiskService) {}

  @Get('matrix') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get risk matrix with cells' })
  async getMatrix(@Request() req: any) { return this.svc.getMatrix(req.user.companyId); }

  @Patch('matrix') @RequiredPermissions('risk.manage_settings') @ApiOperation({ summary: 'Update matrix (creates version snapshot)' })
  async updateMatrix(@Body() dto: UpdateMatrixDto, @Request() req: any) { return this.svc.updateMatrix(req.user.companyId, req.user.id, dto); }

  @Post('matrix/preview') @RequiredPermissions('risk.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Preview risk score for severity × likelihood' })
  async previewScore(@Body() dto: PreviewScoreDto, @Request() req: any) { return this.svc.previewScore(req.user.companyId, dto); }

  @Get('matrix/versions') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get matrix version history' })
  async getVersions(@Request() req: any) { return this.svc.getMatrixVersions(req.user.companyId); }
}
