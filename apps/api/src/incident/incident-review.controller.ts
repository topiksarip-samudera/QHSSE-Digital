import { Controller, Get, Post, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { ReviewIncidentDto, AssignInvestigatorDto } from './dto/incident-review.dto';

@ApiTags('Incident - Review & Workflow') @ApiBearerAuth() @Controller('incidents')
export class IncidentReviewController {
  constructor(private readonly svc: IncidentService) {}

  @Get('review-queue') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incidents pending review' })
  async getReviewQueue(@Request() req: any) { return this.svc.getReviewQueue(req.user.companyId); }

  @Post(':id/review') @RequiredPermissions('incident.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Review and advance incident' })
  async review(@Param('id') id: string, @Body() dto: ReviewIncidentDto, @Request() req: any) { return this.svc.review(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/reject') @RequiredPermissions('incident.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject incident back to draft' })
  async reject(@Param('id') id: string, @Body() dto: ReviewIncidentDto, @Request() req: any) { return this.svc.reject(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/request-revision') @RequiredPermissions('incident.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Request revision on incident' })
  async requestRevision(@Param('id') id: string, @Body() dto: ReviewIncidentDto, @Request() req: any) { return this.svc.requestRevision(id, dto, req.user.companyId, req.user.id); }

  @Post(':id/assign-investigator') @RequiredPermissions('incident.investigate') @ApiOperation({ summary: 'Assign investigator to incident' })
  async assignInvestigator(@Param('id') id: string, @Body() dto: AssignInvestigatorDto, @Request() req: any) { return this.svc.assignInvestigator(id, dto, req.user.companyId, req.user.id); }

  @Get(':id/workflow') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get incident review workflow' })
  async getWorkflow(@Param('id') id: string, @Request() req: any) { return this.svc.getWorkflow(id, req.user.companyId); }
}
