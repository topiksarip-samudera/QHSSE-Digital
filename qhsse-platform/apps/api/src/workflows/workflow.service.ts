import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { CreateWorkflowStepDto, UpdateWorkflowStepDto } from './dto/create-workflow-step.dto';
import {
  CreateWorkflowConditionDto, CreateEscalationDto, CreateDelegationDto,
  CreateSlaRuleDto, SimulateWorkflowDto,
} from './dto/advanced-workflow.dto';
import { CreateWorkflowInstanceDto, WorkflowActionDto, WorkflowQueryDto } from './dto/workflow-instance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  // ─── Workflow Template CRUD ───────────────────────────────────────────

  async createWorkflow(dto: CreateWorkflowDto, userId: string) {
    // Check for duplicate name within company + module
    const existing = await this.prisma.workflow.findFirst({
      where: {
        companyId: dto.companyId ?? null,
        moduleCode: dto.moduleCode,
        name: dto.name,
        deletedAt: null,
      },
    });
    if (existing) {
      throw new BadRequestException('Workflow with this name already exists for this module');
    }

    return this.prisma.workflow.create({
      data: {
        name: dto.name,
        moduleCode: dto.moduleCode,
        description: dto.description,
        isActive: dto.isActive ?? true,
        companyId: dto.companyId,
        createdBy: userId,
      },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
  }

  async findAllWorkflows(query: WorkflowQueryDto, companyId?: string) {
    const where: Prisma.WorkflowWhereInput = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.moduleCode) where.moduleCode = query.moduleCode;
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    // Show global workflows + company-specific ones
    if (companyId) {
      where.OR = [{ companyId: null }, { companyId }];
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.workflow.findMany({
        where,
        include: { steps: { orderBy: { stepOrder: 'asc' }, include: { approvers: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.workflow.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneWorkflow(id: string, companyId?: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, deletedAt: null },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' },
          include: { approvers: true },
        },
        _count: { select: { instances: true } },
      },
    });
    if (!workflow) throw new NotFoundException('Workflow not found');
    if (companyId && workflow.companyId && workflow.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }
    return workflow;
  }

  async updateWorkflow(id: string, dto: UpdateWorkflowDto, companyId?: string) {
    await this.findOneWorkflow(id, companyId);
    return this.prisma.workflow.update({
      where: { id },
      data: dto,
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
  }

  async deleteWorkflow(id: string, companyId?: string) {
    const workflow = await this.findOneWorkflow(id, companyId);
    // Soft delete - don't destroy running instances
    return this.prisma.workflow.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  // ─── Workflow Step Management ─────────────────────────────────────────

  async addStep(workflowId: string, dto: CreateWorkflowStepDto) {
    await this.findOneWorkflow(workflowId);

    // Check duplicate stepOrder
    const existing = await this.prisma.workflowStep.findFirst({
      where: { workflowId, stepOrder: dto.stepOrder },
    });
    if (existing) {
      throw new BadRequestException(`Step order ${dto.stepOrder} already exists`);
    }

    return this.prisma.workflowStep.create({
      data: {
        workflowId,
        name: dto.name,
        stepOrder: dto.stepOrder,
        assigneeType: dto.assigneeType,
        assigneeValue: dto.assigneeValue,
        actionType: dto.actionType,
        isRequired: dto.isRequired ?? true,
        slaHours: dto.slaHours,
        escalateAfterHr: dto.escalateAfterHr,
      },
    });
  }

  async updateStep(stepId: string, dto: UpdateWorkflowStepDto) {
    const step = await this.prisma.workflowStep.findUnique({ where: { id: stepId } });
    if (!step) throw new NotFoundException('Workflow step not found');

    return this.prisma.workflowStep.update({
      where: { id: stepId },
      data: dto,
    });
  }

  async removeStep(stepId: string) {
    const step = await this.prisma.workflowStep.findUnique({ where: { id: stepId } });
    if (!step) throw new NotFoundException('Workflow step not found');

    // Reorder remaining steps
    await this.prisma.workflowStep.updateMany({
      where: { workflowId: step.workflowId, stepOrder: { gt: step.stepOrder } },
      data: { stepOrder: { decrement: 1 } },
    });

    return this.prisma.workflowStep.delete({ where: { id: stepId } });
  }

  async addApprover(stepId: string, userId: string) {
    const step = await this.prisma.workflowStep.findUnique({ where: { id: stepId } });
    if (!step) throw new NotFoundException('Workflow step not found');

    return this.prisma.workflowApprover.upsert({
      where: { stepId_userId: { stepId, userId } },
      update: {},
      create: { stepId, userId },
    });
  }

  async removeApprover(stepId: string, userId: string) {
    return this.prisma.workflowApprover.delete({
      where: { stepId_userId: { stepId, userId } },
    });
  }

  // ─── Workflow Instance Management ─────────────────────────────────────

  async createInstance(dto: CreateWorkflowInstanceDto, userId: string) {
    const workflow = await this.findOneWorkflow(dto.workflowId);

    if (!workflow.isActive) {
      throw new BadRequestException('Cannot create instance of inactive workflow');
    }

    // Check for existing active instance for same record
    const existing = await this.prisma.workflowInstance.findFirst({
      where: {
        recordType: dto.recordType,
        recordId: dto.recordId,
        status: { in: ['draft', 'submitted', 'in_review'] },
      },
    });
    if (existing) {
      throw new BadRequestException('An active workflow instance already exists for this record');
    }

    // Create instance with step tracking
    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowId: dto.workflowId,
        companyId: dto.companyId,
        recordType: dto.recordType,
        recordId: dto.recordId,
        submitterId: userId,
        status: 'draft',
      },
    });

    // Create instance steps from workflow steps
    if (workflow.steps.length > 0) {
      await this.prisma.workflowInstanceStep.createMany({
        data: workflow.steps.map((step) => ({
          instanceId: instance.id,
          stepId: step.id,
          stepOrder: step.stepOrder,
          assigneeType: step.assigneeType,
          assigneeValue: step.assigneeValue,
          status: 'draft' as const,
        })),
      });
    }

    return this.findOneInstance(instance.id);
  }

  async findAllInstances(query: WorkflowQueryDto, companyId?: string) {
    const where: Prisma.WorkflowInstanceWhereInput = {};

    if (query.status) where.status = query.status as any;
    if (companyId) where.companyId = companyId;
    if (query.search) {
      where.OR = [
        { recordType: { contains: query.search, mode: 'insensitive' } },
        { recordId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.workflowInstance.findMany({
        where,
        include: {
          workflow: { select: { id: true, name: true, moduleCode: true } },
          steps: { orderBy: { stepOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.workflowInstance.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneInstance(id: string, companyId?: string) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        workflow: {
          include: {
            steps: { orderBy: { stepOrder: 'asc' }, include: { approvers: true } },
          },
        },
        steps: { orderBy: { stepOrder: 'asc' } },
        histories: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!instance) throw new NotFoundException('Workflow instance not found');
    if (companyId && instance.companyId && instance.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }
    return instance;
  }

  // ─── Workflow Actions ─────────────────────────────────────────────────

  async submitInstance(instanceId: string, userId: string, companyId: string, dto: WorkflowActionDto) {
    const instance = await this.findOneInstance(instanceId, companyId);

    if (instance.status !== 'draft') {
      throw new BadRequestException('Only draft instances can be submitted');
    }

    // Update instance status and first step
    const [updated] = await this.prisma.$transaction([
      this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: { status: 'submitted', startedAt: new Date(), currentStep: 1 },
      }),
      this.prisma.workflowInstanceStep.updateMany({
        where: { instanceId, stepOrder: 1 },
        data: { status: 'submitted' },
      }),
      this.prisma.workflowHistory.create({
        data: {
          instanceId,
          stepOrder: 0,
          action: 'submit',
          performedBy: userId,
          comment: dto.comment,
        },
      }),
    ]);

    return this.findOneInstance(instanceId);
  }

  async approveStep(instanceId: string, userId: string, companyId: string, dto: WorkflowActionDto) {
    const instance = await this.findOneInstance(instanceId, companyId);

    if (!['submitted', 'in_review'].includes(instance.status)) {
      throw new BadRequestException('Instance is not in a reviewable state');
    }

    // Find current step
    const currentStep = instance.steps.find((s) => s.stepOrder === instance.currentStep);
    if (!currentStep) throw new BadRequestException('No current step found');

    // Verify user is authorized to approve
    const isAuthorized = await this.isStepApprover(currentStep.id, userId, currentStep.assigneeType, currentStep.assigneeValue);
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to approve this step');
    }

    const allSteps = instance.workflow.steps;
    const isLastStep = instance.currentStep >= allSteps.length;

    await this.prisma.$transaction([
      // Complete current step
      this.prisma.workflowInstanceStep.update({
        where: { id: currentStep.id },
        data: { status: 'approved', completedBy: userId, completedAt: new Date(), comment: dto.comment },
      }),
      // Update instance
      this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: isLastStep
          ? { status: 'approved', completedAt: new Date() }
          : { status: 'in_review', currentStep: instance.currentStep + 1 },
      }),
      // If not last step, activate next step
      ...(!isLastStep
        ? [
            this.prisma.workflowInstanceStep.updateMany({
              where: { instanceId, stepOrder: instance.currentStep + 1 },
              data: { status: 'submitted' },
            }),
          ]
        : []),
      // Record history
      this.prisma.workflowHistory.create({
        data: {
          instanceId,
          stepOrder: instance.currentStep,
          action: 'approve',
          performedBy: userId,
          comment: dto.comment,
        },
      }),
    ]);

    return this.findOneInstance(instanceId);
  }

  async rejectStep(instanceId: string, userId: string, companyId: string, dto: WorkflowActionDto) {
    if (!dto.comment) {
      throw new BadRequestException('Comment is required when rejecting');
    }

    const instance = await this.findOneInstance(instanceId, companyId);

    if (!['submitted', 'in_review'].includes(instance.status)) {
      throw new BadRequestException('Instance is not in a reviewable state');
    }

    const currentStep = instance.steps.find((s) => s.stepOrder === instance.currentStep);
    if (!currentStep) throw new BadRequestException('No current step found');

    const isAuthorized = await this.isStepApprover(currentStep.id, userId, currentStep.assigneeType, currentStep.assigneeValue);
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to reject this step');
    }

    await this.prisma.$transaction([
      this.prisma.workflowInstanceStep.update({
        where: { id: currentStep.id },
        data: { status: 'rejected', completedBy: userId, completedAt: new Date(), comment: dto.comment },
      }),
      this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: { status: 'rejected', completedAt: new Date() },
      }),
      this.prisma.workflowHistory.create({
        data: {
          instanceId,
          stepOrder: instance.currentStep,
          action: 'reject',
          performedBy: userId,
          comment: dto.comment,
        },
      }),
    ]);

    return this.findOneInstance(instanceId);
  }

  async requestRevision(instanceId: string, userId: string, companyId: string, dto: WorkflowActionDto) {
    if (!dto.comment) {
      throw new BadRequestException('Comment is required when requesting revision');
    }

    const instance = await this.findOneInstance(instanceId, companyId);

    if (!['submitted', 'in_review'].includes(instance.status)) {
      throw new BadRequestException('Instance is not in a reviewable state');
    }

    const currentStep = instance.steps.find((s) => s.stepOrder === instance.currentStep);
    if (!currentStep) throw new BadRequestException('No current step found');

    const isAuthorized = await this.isStepApprover(currentStep.id, userId, currentStep.assigneeType, currentStep.assigneeValue);
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to request revision');
    }

    await this.prisma.$transaction([
      this.prisma.workflowInstanceStep.update({
        where: { id: currentStep.id },
        data: { status: 'in_review', comment: dto.comment },
      }),
      this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: { status: 'draft' },
      }),
      this.prisma.workflowHistory.create({
        data: {
          instanceId,
          stepOrder: instance.currentStep,
          action: 'request_revision',
          performedBy: userId,
          comment: dto.comment,
        },
      }),
    ]);

    return this.findOneInstance(instanceId);
  }

  async closeInstance(instanceId: string, userId: string, companyId: string) {
    const instance = await this.findOneInstance(instanceId, companyId);

    if (!['approved', 'rejected'].includes(instance.status)) {
      throw new BadRequestException('Only approved or rejected instances can be closed');
    }

    await this.prisma.$transaction([
      this.prisma.workflowInstance.update({
        where: { id: instanceId },
        data: { status: 'closed' },
      }),
      this.prisma.workflowHistory.create({
        data: {
          instanceId,
          stepOrder: 0,
          action: 'close',
          performedBy: userId,
        },
      }),
    ]);

    return this.findOneInstance(instanceId);
  }

  async getInstanceHistory(instanceId: string, companyId?: string) {
    const instance = await this.findOneInstance(instanceId, companyId);

    return this.prisma.workflowHistory.findMany({
      where: { instanceId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── SLA Check ────────────────────────────────────────────────────────

  async checkSlaBreaches(companyId?: string) {
    const where: Prisma.WorkflowInstanceStepWhereInput = {
      status: { in: ['submitted', 'in_review'] },
      dueAt: { lt: new Date() },
    };

    const breached = await this.prisma.workflowInstanceStep.findMany({
      where,
      include: {
        instance: { include: { workflow: true } },
      },
    });

    return breached;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────

  private async isStepApprover(
    stepId: string,
    userId: string,
    assigneeType: string,
    assigneeValue: string,
  ): Promise<boolean> {
    // Check direct approver assignment
    const approver = await this.prisma.workflowApprover.findFirst({
      where: { stepId, userId },
    });
    if (approver) return true;

    // Check by role
    if (assigneeType === 'role') {
      const userRole = await this.prisma.userRoleAssignment.findFirst({
        where: {
          userId,
          role: { code: assigneeValue },
        },
      });
      return !!userRole;
    }

    // Check by user
    if (assigneeType === 'user') {
      return assigneeValue === userId;
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED WORKFLOW (Phase 2)
  // ═══════════════════════════════════════════════════════════════════════════

  async addCondition(stepId: string, dto: CreateWorkflowConditionDto) {
    return this.prisma.workflowCondition.create({ data: { stepId, field: dto.field, operator: dto.operator, value: dto.value, groupId: dto.groupId, logicalOr: dto.logicalOr || false } });
  }

  async getConditions(stepId: string) {
    return this.prisma.workflowCondition.findMany({ where: { stepId }, orderBy: { createdAt: 'asc' } });
  }

  async deleteCondition(id: string) {
    await this.prisma.workflowCondition.delete({ where: { id } });
    return { success: true };
  }

  async simulateWorkflow(workflowId: string, recordData?: Record<string, any>) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { steps: { orderBy: { stepOrder: 'asc' }, include: { conditions: true, parallelSteps: true } } },
    });
    if (!workflow) throw new NotFoundException('Workflow not found');

    const steps = workflow.steps.map((step) => {
      let active = true;
      if (step.conditions.length > 0 && recordData) {
        active = step.conditions.every((c) => {
          const fieldVal = this.resolveFieldValue(recordData, c.field);
          return this.evaluateCondition(fieldVal, c.operator, c.value);
        });
      }
      const parallelGroup = step.parallelSteps.length > 0 ? step.parallelSteps.map((ps) => ({ stepGroupId: ps.stepGroupId })) : [];
      return { stepName: step.name, stepOrder: step.stepOrder, assigneeType: step.assigneeType, assigneeValue: step.assigneeValue, active, slaHours: step.slaHours, parallelGroups: parallelGroup };
    });

    return { workflowName: workflow.name, steps, totalSteps: steps.length, activeSteps: steps.filter((s) => s.active).length };
  }

  async createEscalation(companyId: string, dto: CreateEscalationDto) {
    return this.prisma.workflowEscalation.create({ data: { ...dto, companyId, isActive: true } });
  }

  async getEscalations(workflowId: string) {
    return this.prisma.workflowEscalation.findMany({ where: { workflowId }, include: { step: { select: { name: true, stepOrder: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async deleteEscalation(id: string) {
    await this.prisma.workflowEscalation.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async createDelegation(companyId: string, dto: CreateDelegationDto) {
    return this.prisma.workflowDelegation.create({
      data: { delegatorId: 'currentUser', delegateId: dto.delegateId, workflowId: dto.workflowId, stepId: dto.stepId, companyId, endDate: new Date(dto.endDate), reason: dto.reason },
    });
  }

  async getDelegations(companyId: string) {
    return this.prisma.workflowDelegation.findMany({
      where: { companyId, isActive: true },
      include: { delegator: { select: { email: true } }, delegate: { select: { email: true } }, workflow: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDelegation(id: string) {
    await this.prisma.workflowDelegation.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async createSlaRule(companyId: string, dto: CreateSlaRuleDto) {
    return this.prisma.workflowSlaRule.create({ data: { ...dto, companyId, isActive: true } });
  }

  async getSlaRules(workflowId: string) {
    return this.prisma.workflowSlaRule.findMany({ where: { workflowId }, include: { step: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async deleteSlaRule(id: string) {
    await this.prisma.workflowSlaRule.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  private resolveFieldValue(data: Record<string, any>, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let val: any = data;
    for (const p of parts) { if (val === undefined || val === null) return undefined; val = val[p]; }
    return val;
  }

  private evaluateCondition(fieldValue: any, operator: string, compareValue: string): boolean {
    switch (operator) {
      case 'eq': return String(fieldValue) === compareValue;
      case 'neq': return String(fieldValue) !== compareValue;
      case 'gt': return Number(fieldValue) > Number(compareValue);
      case 'lt': return Number(fieldValue) < Number(compareValue);
      case 'gte': return Number(fieldValue) >= Number(compareValue);
      case 'lte': return Number(fieldValue) <= Number(compareValue);
      case 'contains': return String(fieldValue).includes(compareValue);
      case 'in': return compareValue.split(',').includes(String(fieldValue));
      case 'not_in': return !compareValue.split(',').includes(String(fieldValue));
      default: return true;
    }
  }
}
