import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AuditService } from './audit.service';

@ApiTags('Audit - Programs, Plans & Audits') @ApiBearerAuth() @Controller()
export class AuditCrudController {
  constructor(private readonly svc: AuditService) {}

  // Programs
  @Post('audit-programs') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create audit program' })
  async createProgram(@Body() d: any, @Request() req: any) { return this.svc.createProgram(d, req.user.companyId, req.user.id); }
  @Get('audit-programs') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List audit programs' })
  async getPrograms(@Request() req: any) { return this.svc.getPrograms(req.user.companyId); }
  @Get('audit-programs/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get program detail' })
  async getProgram(@Param('id') id: string, @Request() req: any) { return this.svc.getProgram(id, req.user.companyId); }
  @Patch('audit-programs/:id') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Update program' })
  async updateProgram(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateProgram(id, d, req.user.companyId); }
  @Delete('audit-programs/:id') @RequiredPermissions('audit.delete') @ApiOperation({ summary: 'Delete program' })
  async deleteProgram(@Param('id') id: string, @Request() req: any) { return this.svc.deleteProgram(id, req.user.companyId); }

  // Plans
  @Post('audit-plans') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create audit plan' })
  async createPlan(@Body() d: any, @Request() req: any) { return this.svc.createPlan(d, req.user.companyId, req.user.id); }
  @Get('audit-plans') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List audit plans' })
  async getPlans(@Request() req: any, @Query('programId') pid?: string) { return this.svc.getPlans(req.user.companyId, pid); }
  @Get('audit-plans/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get plan detail' })
  async getPlan(@Param('id') id: string, @Request() req: any) { return this.svc.getPlan(id, req.user.companyId); }
  @Delete('audit-plans/:id') @RequiredPermissions('audit.delete') @ApiOperation({ summary: 'Delete plan' })
  async deletePlan(@Param('id') id: string, @Request() req: any) { return this.svc.deletePlan(id, req.user.companyId); }

  // Audits
  @Post('audits') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create audit' })
  async createAudit(@Body() d: any, @Request() req: any) { return this.svc.createAudit(d, req.user.companyId, req.user.id); }
  @Get('audits') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List audits' })
  async getAudits(@Request() req: any, @Query('planId') pid?: string, @Query('programId') prgid?: string) { return this.svc.getAudits(req.user.companyId, pid, prgid); }
  @Get('audits/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get audit detail' })
  async getAudit(@Param('id') id: string, @Request() req: any) { return this.svc.getAudit(id, req.user.companyId); }
  @Patch('audits/:id') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Update audit' })
  async updateAudit(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateAudit(id, d, req.user.companyId); }
  @Delete('audits/:id') @RequiredPermissions('audit.delete') @ApiOperation({ summary: 'Delete audit' })
  async deleteAudit(@Param('id') id: string, @Request() req: any) { return this.svc.deleteAudit(id, req.user.companyId); }

  // Inspection Plans
  @Post('inspection-plans') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create inspection plan' })
  async createInspectionPlan(@Body() d: any, @Request() req: any) { return this.svc.createInspectionPlan(d, req.user.companyId, req.user.id); }
  @Get('inspection-plans') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List inspection plans' })
  async getInspectionPlans(@Request() req: any) { return this.svc.getInspectionPlans(req.user.companyId); }
  @Get('inspection-plans/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get inspection plan' })
  async getInspectionPlan(@Param('id') id: string, @Request() req: any) { return this.svc.getInspectionPlan(id, req.user.companyId); }
  @Patch('inspection-plans/:id') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Update plan' })
  async updateInspectionPlan(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateInspectionPlan(id, d, req.user.companyId); }
  @Delete('inspection-plans/:id') @RequiredPermissions('audit.delete') @ApiOperation({ summary: 'Delete plan' })
  async deleteInspectionPlan(@Param('id') id: string, @Request() req: any) { return this.svc.deleteInspectionPlan(id, req.user.companyId); }

  // Inspections
  @Post('inspections') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create inspection' })
  async createInspection(@Body() d: any, @Request() req: any) { return this.svc.createInspection(d, req.user.companyId, req.user.id); }
  @Get('inspections') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List inspections' })
  async getInspections(@Request() req: any, @Query('planId') pid?: string) { return this.svc.getInspections(req.user.companyId, pid); }
  @Get('inspections/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get inspection' })
  async getInspection(@Param('id') id: string, @Request() req: any) { return this.svc.getInspection(id, req.user.companyId); }
  @Patch('inspections/:id') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Update inspection' })
  async updateInspection(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateInspection(id, d, req.user.companyId); }
  @Delete('inspections/:id') @RequiredPermissions('audit.delete') @ApiOperation({ summary: 'Delete inspection' })
  async deleteInspection(@Param('id') id: string, @Request() req: any) { return this.svc.deleteInspection(id, req.user.companyId); }

  // Checklist Execution
  @Post('checklist-execution/start') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Start checklist execution for audit/inspection' })
  async startExecution(@Body('recordType') rt: string, @Body('recordId') rid: string, @Body('checklistId') cid: string, @Request() req: any) { return this.svc.startExecution(rt, rid, cid, req.user.companyId); }
  @Get('checklist-execution/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get execution result with items' })
  async getExecution(@Param('id') id: string, @Request() req: any) { return this.svc.getExecutionResult(id, req.user.companyId); }
  @Patch('checklist-execution/items/:itemId') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Answer execution item' })
  async answerItem(@Param('itemId') itemId: string, @Body() d: any, @Request() req: any) { return this.svc.answerItem(itemId, d, req.user.companyId); }
  @Post('checklist-execution/:id/complete') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete checklist execution' })
  async completeExecution(@Param('id') id: string, @Request() req: any) { return this.svc.completeExecution(id, req.user.companyId, req.user.id); }

  // Audit Execution Workflow
  @Post('audits/:id/start') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Start audit execution' })
  async startAudit(@Param('id') id: string, @Request() req: any) { return this.svc.startAudit(id, req.user.companyId, req.user.id); }
  @Post('audits/:id/notes') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Add execution note' })
  async addNote(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addExecutionNote(id, d, req.user.companyId, req.user.id); }
  @Get('audits/:id/notes') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get execution notes' })
  async getNotes(@Param('id') id: string, @Request() req: any) { return this.svc.getExecutionNotes(id, req.user.companyId); }
  @Get('audits/:id/progress') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get audit progress' })
  async getProgress(@Param('id') id: string, @Request() req: any) { return this.svc.getAuditProgress(id, req.user.companyId); }
  @Post('audits/:id/complete') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Complete audit → draft report' })
  async completeAudit(@Param('id') id: string, @Request() req: any) { return this.svc.completeAudit(id, req.user.companyId, req.user.id); }

  // Inspection Execution Workflow
  @Post('inspections/:id/start') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Start inspection' })
  async startInspection(@Param('id') id: string, @Request() req: any) { return this.svc.startInspection(id, req.user.companyId, req.user.id); }
  @Post('inspections/:id/notes') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Add inspection note' })
  async addInspectionNote(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addInspectionNote(id, d, req.user.companyId, req.user.id); }
  @Get('inspections/:id/notes') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get inspection notes' })
  async getInspectionNotes(@Param('id') id: string, @Request() req: any) { return this.svc.getInspectionNotes(id, req.user.companyId); }
  @Get('inspections/:id/progress') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get inspection progress' })
  async getInspectionProgress(@Param('id') id: string, @Request() req: any) { return this.svc.getInspectionProgress(id, req.user.companyId); }
  @Post('inspections/:id/submit') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit inspection → completed' })
  async submitInspection(@Param('id') id: string, @Request() req: any) { return this.svc.submitInspection(id, req.user.companyId, req.user.id); }
  @Post('inspections/:id/close') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Close inspection' })
  async closeInspection(@Param('id') id: string, @Request() req: any) { return this.svc.closeInspection(id, req.user.companyId); }

  // Findings & Nonconformity
  @Post('findings') @RequiredPermissions('audit.create') @ApiOperation({ summary: 'Create finding' })
  async createFinding(@Body() d: any, @Request() req: any) { return this.svc.createFinding(d, req.user.companyId, req.user.id); }
  @Get('findings') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'List findings' })
  async getFindings(@Request() req: any, @Query('recordType') rt?: string, @Query('recordId') rid?: string) { return this.svc.getFindings(req.user.companyId, rt, rid); }
  @Get('findings/:id') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get finding' })
  async getFinding(@Param('id') id: string, @Request() req: any) { return this.svc.getFinding(id, req.user.companyId); }
  @Patch('findings/:id') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Update finding' })
  async updateFinding(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateFinding(id, d, req.user.companyId); }
  @Post('findings/:id/assign') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Assign finding' })
  async assignFinding(@Param('id') id: string, @Body('assignedTo') at: string, @Request() req: any) { return this.svc.assignFinding(id, at, req.user.companyId, req.user.id); }
  @Post('findings/:id/close') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Close finding' })
  async closeFinding(@Param('id') id: string, @Request() req: any) { return this.svc.closeFinding(id, req.user.companyId, req.user.id); }

  // Corrective Action & Verification
  @Post('findings/:id/actions') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Link action to finding' })
  async linkAction(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.linkActionToFinding(id, d.actionId, d.actionType, req.user.companyId); }
  @Get('findings/:id/actions') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get actions for finding' })
  async getFindingActions(@Param('id') id: string, @Request() req: any) { return this.svc.getFindingActions(id, req.user.companyId); }
  @Post('findings/:id/verify') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify finding' })
  async verifyFinding(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.verifyFinding(id, d, req.user.companyId); }
  @Get('findings/:id/verifications') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get verifications' })
  async getVerifications(@Param('id') id: string, @Request() req: any) { return this.svc.getFindingVerifications(id, req.user.companyId); }

  // Scoring & Rating
  @Post('scoring/calculate') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Calculate score for audit/inspection' })
  async calculateScore(@Body('recordType') rt: string, @Body('recordId') rid: string, @Request() req: any) { return this.svc.calculateScore(rt, rid, req.user.companyId, req.user.id); }
  @Get('scoring') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get score history' })
  async getScores(@Request() req: any, @Query('recordType') rt?: string, @Query('recordId') rid?: string) { return this.svc.getScores(req.user.companyId, rt, rid); }
  @Get('scoring/compliance-summary') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get compliance summary' })
  async getComplianceSummary(@Request() req: any) { return this.svc.getComplianceSummary(req.user.companyId); }

  // Reports & Approval
  @Post('reports/audit/:auditId') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Generate audit report' })
  async generateAuditReport(@Param('auditId') auditId: string, @Request() req: any) { return this.svc.generateAuditReport(auditId, req.user.companyId, req.user.id); }
  @Get('reports/audit/:auditId') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get audit report' })
  async getAuditReport(@Param('auditId') auditId: string, @Request() req: any) { return this.svc.getAuditReport(auditId, req.user.companyId); }
  @Post('reports/inspection/:inspectionId') @RequiredPermissions('audit.update') @ApiOperation({ summary: 'Generate inspection report' })
  async generateInspectionReport(@Param('inspectionId') iid: string, @Request() req: any) { return this.svc.generateInspectionReport(iid, req.user.companyId, req.user.id); }
  @Get('reports/inspection/:inspectionId') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Get inspection report' })
  async getInspectionReport(@Param('inspectionId') iid: string, @Request() req: any) { return this.svc.getInspectionReport(iid, req.user.companyId); }
  @Post('reports/:id/submit') @RequiredPermissions('audit.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit report' })
  async submitReport(@Param('id') id: string, @Request() req: any) { return this.svc.submitReport(id, req.user.companyId); }
  @Post('reports/:id/approve') @RequiredPermissions('audit.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve report' })
  async approveReport(@Param('id') id: string, @Request() req: any) { return this.svc.approveReport(id, req.user.companyId, req.user.id); }
  @Post('reports/:id/reject') @RequiredPermissions('audit.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject report' })
  async rejectReport(@Param('id') id: string, @Request() req: any) { return this.svc.rejectReport(id, req.user.companyId); }

  // Dashboard, KPI & Trends
  @Get('dashboard') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Audit/Inspection dashboard' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }
  @Get('kpi') @RequiredPermissions('audit.view') @ApiOperation({ summary: 'Yearly KPIs' })
  async getKpi(@Request() req: any, @Query('year') year?: string) { return this.svc.getKpi(req.user.companyId, year ? Number(year) : undefined); }
  @Get('trends') @RequiredPermissions('audit.view') @ApiOperation({ summary: '12-month trends' })
  async getTrends(@Request() req: any) { return this.svc.getTrends(req.user.companyId); }
}
