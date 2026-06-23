import { Controller, Get, Post, Patch, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ComplianceService } from './compliance.service';
import { CreateAccessReviewDto, CreatePermissionReviewDto, AcknowledgePolicyDto } from './dto/compliance.dto';

@ApiTags('Compliance & Control Center') @ApiBearerAuth() @Controller()
export class ComplianceController {
  constructor(private readonly svc: ComplianceService) {}

  @Post('access-reviews') @RequiredPermissions('compliance-control-center.create') @ApiOperation({ summary: 'Create access review' })
  async createAccessReview(@Body() dto: CreateAccessReviewDto, @Request() req: any) { return this.svc.createAccessReview(dto, req.user.companyId, req.user.id); }
  @Get('access-reviews') @RequiredPermissions('compliance-control-center.view') @ApiOperation({ summary: 'Get access reviews' })
  async getAccessReviews(@Request() req: any) { return this.svc.getAccessReviews(req.user.companyId); }
  @Patch('access-reviews/:id') @RequiredPermissions('compliance-control-center.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Update access review status' })
  async updateAccessReview(@Param('id') id: string, @Body('status') status: string, @Request() req: any) { return this.svc.updateAccessReview(id, status, req.user.id, req.user.companyId); }

  @Post('permission-reviews') @RequiredPermissions('compliance-control-center.create') @ApiOperation({ summary: 'Create permission review' })
  async createPermissionReview(@Body() dto: CreatePermissionReviewDto, @Request() req: any) { return this.svc.createPermissionReview(dto, req.user.companyId, req.user.id); }
  @Get('permission-reviews') @RequiredPermissions('compliance-control-center.view') @ApiOperation({ summary: 'Get permission reviews' })
  async getPermissionReviews(@Request() req: any) { return this.svc.getPermissionReviews(req.user.companyId); }

  @Post('policy-acknowledgements') @RequiredPermissions('compliance-control-center.create') @ApiOperation({ summary: 'Acknowledge a policy' })
  async acknowledgePolicy(@Body() dto: AcknowledgePolicyDto, @Request() req: any) { return this.svc.acknowledgePolicy(dto, req.user.companyId, req.user.id); }
  @Get('policy-acknowledgements') @RequiredPermissions('compliance-control-center.view') @ApiOperation({ summary: 'Get policy acknowledgements' })
  async getAcknowledgements(@Request() req: any) { return this.svc.getAcknowledgements(req.user.companyId); }

  @Get('compliance-score') @RequiredPermissions('compliance-control-center.view') @ApiOperation({ summary: 'Get compliance score' })
  async getComplianceScore(@Request() req: any) { return this.svc.getComplianceScore(req.user.companyId); }
}
