import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { GapAnalysisService } from './gap-analysis.service';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class GapAnalysisController {
  constructor(private readonly svc: GapAnalysisService) {}

  @Get('gap-analysis') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get competency gap analysis' })
  async getGapAnalysis(@Request() req: any) { return this.svc.getGapAnalysis(req.user.companyId); }

  @Get('gap-analysis/user/:userId') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get user gap analysis' })
  async getUserGapAnalysis(@Param('userId') userId: string, @Request() req: any) { return this.svc.getUserGapAnalysis(userId, req.user.companyId); }
}
