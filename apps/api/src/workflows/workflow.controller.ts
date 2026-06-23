import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { CreateWorkflowStepDto, UpdateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { CreateWorkflowInstanceDto, WorkflowActionDto, WorkflowQueryDto } from './dto/workflow-instance.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import {
  CreateWorkflowConditionDto, CreateEscalationDto, CreateDelegationDto,
  CreateSlaRuleDto, SimulateWorkflowDto,
} from './dto/advanced-workflow.dto';

@ApiTags('Workflow Engine')
@ApiBearerAuth()
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly service: WorkflowService) {}

  // ─── WORKFLOW TEMPLATES ────────────────────────────────────────────────

  @Get()
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'List all workflow templates' })
  async findAll(@Query() query: WorkflowQueryDto, @CurrentUser() user: any) {
    return this.service.findAllWorkflows(query, user.companyId);
  }

  @Get(':id')
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'Get workflow template by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOneWorkflow(id, user.companyId);
  }

  @Post()
  @RequiredPermissions('workflow-engine-basic.create')
  @ApiOperation({ summary: 'Create a new workflow template' })
  async create(@Body() dto: CreateWorkflowDto, @CurrentUser() user: any) {
    return this.service.createWorkflow(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('workflow-engine-basic.update')
  @ApiOperation({ summary: 'Update a workflow template' })
  async update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto, @CurrentUser() user: any) {
    return this.service.updateWorkflow(id, dto, user.companyId);
  }

  @Delete(':id')
  @RequiredPermissions('workflow-engine-basic.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete (soft) a workflow template' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.deleteWorkflow(id, user.companyId);
  }

  // ─── WORKFLOW STEPS ───────────────────────────────────────────────────

  @Post(':workflowId/steps')
  @RequiredPermissions('workflow-engine-basic.update')
  @ApiOperation({ summary: 'Add a step to a workflow' })
  async addStep(
    @Param('workflowId') workflowId: string,
    @Body() dto: CreateWorkflowStepDto,
  ) {
    return this.service.addStep(workflowId, dto);
  }

  @Patch('steps/:stepId')
  @RequiredPermissions('workflow-engine-basic.update')
  @ApiOperation({ summary: 'Update a workflow step' })
  async updateStep(
    @Param('stepId') stepId: string,
    @Body() dto: UpdateWorkflowStepDto,
  ) {
    return this.service.updateStep(stepId, dto);
  }

  @Delete('steps/:stepId')
  @RequiredPermissions('workflow-engine-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a workflow step' })
  async removeStep(@Param('stepId') stepId: string) {
    return this.service.removeStep(stepId);
  }

  // ─── STEP APPROVERS ──────────────────────────────────────────────────

  @Post('steps/:stepId/approvers')
  @RequiredPermissions('workflow-engine-basic.update')
  @ApiOperation({ summary: 'Add an approver to a workflow step' })
  async addApprover(
    @Param('stepId') stepId: string,
    @Body() dto: { userId: string },
  ) {
    return this.service.addApprover(stepId, dto.userId);
  }

  @Delete('steps/:stepId/approvers/:userId')
  @RequiredPermissions('workflow-engine-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an approver from a workflow step' })
  async removeApprover(
    @Param('stepId') stepId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.removeApprover(stepId, userId);
  }

  // ─── WORKFLOW INSTANCES ───────────────────────────────────────────────

  @Post('instances')
  @RequiredPermissions('workflow-engine-basic.create')
  @ApiOperation({ summary: 'Create a workflow instance from a template' })
  async createInstance(
    @Body() dto: CreateWorkflowInstanceDto,
    @CurrentUser() user: any,
  ) {
    return this.service.createInstance(dto, user.sub);
  }

  @Get('instances/list')
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'List all workflow instances' })
  async findAllInstances(
    @Query() query: WorkflowQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.service.findAllInstances(query, user.companyId);
  }

  @Get('instances/:id')
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'Get workflow instance by ID' })
  async findOneInstance(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOneInstance(id, user.companyId);
  }

  // ─── WORKFLOW ACTIONS ─────────────────────────────────────────────────

  @Post('instances/:id/submit')
  @RequiredPermissions('workflow-engine-basic.submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a draft workflow instance' })
  async submitInstance(
    @Param('id') id: string,
    @Body() dto: WorkflowActionDto,
    @CurrentUser() user: any,
  ) {
    return this.service.submitInstance(id, user.sub, user.companyId, dto);
  }

  @Post('instances/:id/approve')
  @RequiredPermissions('workflow-engine-basic.approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve the current step of a workflow instance' })
  async approveStep(
    @Param('id') id: string,
    @Body() dto: WorkflowActionDto,
    @CurrentUser() user: any,
  ) {
    return this.service.approveStep(id, user.sub, user.companyId, dto);
  }

  @Post('instances/:id/reject')
  @RequiredPermissions('workflow-engine-basic.reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject the current step (comment required)' })
  async rejectStep(
    @Param('id') id: string,
    @Body() dto: WorkflowActionDto,
    @CurrentUser() user: any,
  ) {
    return this.service.rejectStep(id, user.sub, user.companyId, dto);
  }

  @Post('instances/:id/request-revision')
  @RequiredPermissions('workflow-engine-basic.approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request revision on the current step' })
  async requestRevision(
    @Param('id') id: string,
    @Body() dto: WorkflowActionDto,
    @CurrentUser() user: any,
  ) {
    return this.service.requestRevision(id, user.sub, user.companyId, dto);
  }

  @Post('instances/:id/close')
  @RequiredPermissions('workflow-engine-basic.close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close an approved or rejected instance' })
  async closeInstance(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.service.closeInstance(id, user.sub, user.companyId);
  }

  // ─── HISTORY & SLA ───────────────────────────────────────────────────

  @Get('instances/:id/history')
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'Get workflow instance history' })
  async getInstanceHistory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.getInstanceHistory(id, user.companyId);
  }

  @Get('sla/breaches')
  @RequiredPermissions('workflow-engine-basic.view')
  @ApiOperation({ summary: 'Get SLA breached steps' })
  async checkSlaBreaches(@CurrentUser() user: any) {
    return this.service.checkSlaBreaches(user.companyId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED WORKFLOW (Phase 2)
  // ═══════════════════════════════════════════════════════════════════════════

  @Post(':id/simulate')
  @RequiredPermissions('advanced-workflow-engine.view')
  @ApiOperation({ summary: 'Simulate workflow execution' })
  async simulate(@Param('id') id: string, @Body() dto: SimulateWorkflowDto) {
    return this.service.simulateWorkflow(id, dto.recordData);
  }

  @Post(':workflowId/steps/:stepId/conditions')
  @RequiredPermissions('advanced-workflow-engine.update')
  @ApiOperation({ summary: 'Add condition to workflow step' })
  async addCondition(@Param('stepId') stepId: string, @Body() dto: CreateWorkflowConditionDto) {
    return this.service.addCondition(stepId, dto);
  }

  @Get(':workflowId/steps/:stepId/conditions')
  @RequiredPermissions('advanced-workflow-engine.view')
  @ApiOperation({ summary: 'Get conditions for workflow step' })
  async getConditions(@Param('stepId') stepId: string) {
    return this.service.getConditions(stepId);
  }

  @Delete(':workflowId/conditions/:conditionId')
  @RequiredPermissions('advanced-workflow-engine.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete workflow condition' })
  async deleteCondition(@Param('conditionId') conditionId: string) {
    return this.service.deleteCondition(conditionId);
  }

  @Post('escalations')
  @RequiredPermissions('advanced-workflow-engine.create')
  @ApiOperation({ summary: 'Create escalation rule' })
  async createEscalation(@Body() dto: CreateEscalationDto, @CurrentUser() user: any) {
    return this.service.createEscalation(user.companyId, dto);
  }

  @Get('escalations')
  @RequiredPermissions('advanced-workflow-engine.view')
  @ApiOperation({ summary: 'List escalation rules' })
  async getEscalations(@Query('workflowId') workflowId: string) {
    return this.service.getEscalations(workflowId);
  }

  @Delete('escalations/:id')
  @RequiredPermissions('advanced-workflow-engine.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete escalation rule' })
  async deleteEscalation(@Param('id') id: string) {
    return this.service.deleteEscalation(id);
  }

  @Post('delegations')
  @RequiredPermissions('advanced-workflow-engine.create')
  @ApiOperation({ summary: 'Create delegation' })
  async createDelegation(@Body() dto: CreateDelegationDto, @CurrentUser() user: any) {
    return this.service.createDelegation(user.companyId, dto);
  }

  @Get('delegations')
  @RequiredPermissions('advanced-workflow-engine.view')
  @ApiOperation({ summary: 'List active delegations' })
  async getDelegations(@CurrentUser() user: any) {
    return this.service.getDelegations(user.companyId);
  }

  @Delete('delegations/:id')
  @RequiredPermissions('advanced-workflow-engine.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke delegation' })
  async deleteDelegation(@Param('id') id: string) {
    return this.service.deleteDelegation(id);
  }

  @Post('sla-rules')
  @RequiredPermissions('advanced-workflow-engine.create')
  @ApiOperation({ summary: 'Create SLA rule' })
  async createSlaRule(@Body() dto: CreateSlaRuleDto, @CurrentUser() user: any) {
    return this.service.createSlaRule(user.companyId, dto);
  }

  @Get('sla-rules')
  @RequiredPermissions('advanced-workflow-engine.view')
  @ApiOperation({ summary: 'List SLA rules for workflow' })
  async getSlaRules(@Query('workflowId') workflowId: string) {
    return this.service.getSlaRules(workflowId);
  }

  @Delete('sla-rules/:id')
  @RequiredPermissions('advanced-workflow-engine.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete SLA rule' })
  async deleteSlaRule(@Param('id') id: string) {
    return this.service.deleteSlaRule(id);
  }
}
