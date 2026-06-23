import { Controller, Get, Post, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';

@ApiTags('Risk - Review & Approval') @ApiBearerAuth() @Controller('risks')
export class RiskReviewController {
  constructor(private readonly svc: RiskService) {}

  @Get('review-queue') @RequiredPermissions('risk.review') @ApiOperation({ summary: 'Get risks pending review' })
  async getReviewQueue(@Request() req: any) { return this.svc.getReviewQueue(req.user.companyId); }

  @Post(':id/review') @RequiredPermissions('risk.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Review and advance to under_review' })
  async review(@Param('id') id: string, @Body('comment') comment: string, @Request() req: any) { return this.svc.review(id, req.user.companyId, req.user.id, comment); }

  @Post(':id/approve') @RequiredPermissions('risk.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve risk' })
  async approve(@Param('id') id: string, @Body('comment') comment: string, @Request() req: any) { return this.svc.approve(id, req.user.companyId, req.user.id, comment); }

  @Post(':id/reject') @RequiredPermissions('risk.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject risk back to draft' })
  async reject(@Param('id') id: string, @Body('comment') comment: string, @Request() req: any) { return this.svc.reject(id, req.user.companyId, req.user.id, comment); }

  @Post(':id/request-revision') @RequiredPermissions('risk.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Request revision' })
  async requestRevision(@Param('id') id: string, @Body('comment') comment: string, @Request() req: any) { return this.svc.requestRevision(id, req.user.companyId, req.user.id, comment); }

  @Get(':id/review-history') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get review history' })
  async getReviewHistory(@Param('id') id: string, @Request() req: any) { return this.svc.getReviewHistory(id, req.user.companyId); }
}
