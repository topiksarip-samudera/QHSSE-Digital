import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  // ─── Programs ──────────────────────────────────────────────────────────

  async createProgram(data: { title: string; description?: string; period?: string; objectives?: string; scope?: string }, companyId: string, userId: string) {
    return this.prisma.auditProgram.create({ data: { ...data, companyId, createdBy: userId } });
  }

  async getPrograms(companyId: string) {
    return this.prisma.auditProgram.findMany({ where: { companyId, deletedAt: null }, include: { _count: { select: { plans: true, audits: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async getProgram(id: string, companyId: string) {
    const p = await this.prisma.auditProgram.findUnique({ where: { id }, include: { plans: true, audits: true } });
    if (!p || p.companyId !== companyId) throw new NotFoundException('Not found');
    return p;
  }

  async updateProgram(id: string, data: any, companyId: string) {
    await this.getProgram(id, companyId);
    return this.prisma.auditProgram.update({ where: { id }, data });
  }

  async deleteProgram(id: string, companyId: string) {
    await this.getProgram(id, companyId);
    await this.prisma.auditProgram.update({ where: { id }, data: { deletedAt: new Date(), status: 'closed' } });
    return { success: true };
  }

  // ─── Plans ─────────────────────────────────────────────────────────────

  async createPlan(data: { programId: string; title: string; description?: string; auditDate: string; duration?: string; leadAuditorId?: string; siteId?: string; department?: string }, companyId: string, userId: string) {
    await this.getProgram(data.programId, companyId);
    return this.prisma.auditPlan.create({ data: { ...data, auditDate: new Date(data.auditDate), companyId, createdBy: userId } });
  }

  async getPlans(companyId: string, programId?: string) {
    const where: any = { companyId, deletedAt: null };
    if (programId) where.programId = programId;
    return this.prisma.auditPlan.findMany({ where, orderBy: { auditDate: 'asc' } });
  }

  async getPlan(id: string, companyId: string) {
    const p = await this.prisma.auditPlan.findUnique({ where: { id }, include: { program: { select: { title: true } } } });
    if (!p || p.companyId !== companyId) throw new NotFoundException('Not found');
    return p;
  }

  async deletePlan(id: string, companyId: string) {
    const p = await this.getPlan(id, companyId);
    await this.prisma.auditPlan.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true };
  }

  // ─── Audits ────────────────────────────────────────────────────────────

  async createAudit(data: { title: string; description?: string; planId?: string; programId?: string; auditTypeId?: string; startDate?: string; endDate?: string; leadAuditorId?: string; auditee?: string }, companyId: string, userId: string) {
    return this.prisma.audit.create({
      data: { ...data, startDate: data.startDate ? new Date(data.startDate) : null, endDate: data.endDate ? new Date(data.endDate) : null, companyId, createdBy: userId },
    });
  }

  async getAudits(companyId: string, planId?: string, programId?: string) {
    const where: any = { companyId, deletedAt: null };
    if (planId) where.planId = planId;
    if (programId) where.programId = programId;
    return this.prisma.audit.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async getAudit(id: string, companyId: string) {
    const a = await this.prisma.audit.findUnique({ where: { id } });
    if (!a || a.companyId !== companyId) throw new NotFoundException('Not found');
    return a;
  }

  async updateAudit(id: string, data: any, companyId: string) {
    await this.getAudit(id, companyId);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.prisma.audit.update({ where: { id }, data });
  }

  async deleteAudit(id: string, companyId: string) {
    await this.getAudit(id, companyId);
    await this.prisma.audit.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true };
  }

  // ─── Inspection Plans & Inspections ────────────────────────────────────

  async createInspectionPlan(data: any, companyId: string, userId: string) {
    return this.prisma.inspectionPlan.create({ data: { ...data, companyId, createdBy: userId } });
  }

  async getInspectionPlans(companyId: string) {
    return this.prisma.inspectionPlan.findMany({ where: { companyId, deletedAt: null }, include: { _count: { select: { inspections: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async getInspectionPlan(id: string, companyId: string) {
    const p = await this.prisma.inspectionPlan.findUnique({ where: { id }, include: { inspections: true } });
    if (!p || p.companyId !== companyId) throw new NotFoundException('Not found');
    return p;
  }

  async updateInspectionPlan(id: string, data: any, companyId: string) { await this.getInspectionPlan(id, companyId); return this.prisma.inspectionPlan.update({ where: { id }, data }); }

  async deleteInspectionPlan(id: string, companyId: string) {
    await this.getInspectionPlan(id, companyId);
    await this.prisma.inspectionPlan.update({ where: { id }, data: { deletedAt: new Date(), status: 'completed' } });
    return { success: true };
  }

  async createInspection(data: any, companyId: string, userId: string) {
    return this.prisma.inspection.create({ data: { ...data, companyId, createdBy: userId } });
  }

  async getInspections(companyId: string, planId?: string) {
    const where: any = { companyId, deletedAt: null };
    if (planId) where.planId = planId;
    return this.prisma.inspection.findMany({ where, orderBy: { dueDate: 'asc' }, take: 50 });
  }

  async getInspection(id: string, companyId: string) {
    const i = await this.prisma.inspection.findUnique({ where: { id } });
    if (!i || i.companyId !== companyId) throw new NotFoundException('Not found');
    return i;
  }

  async updateInspection(id: string, data: any, companyId: string) { await this.getInspection(id, companyId); return this.prisma.inspection.update({ where: { id }, data }); }

  async deleteInspection(id: string, companyId: string) {
    await this.getInspection(id, companyId);
    await this.prisma.inspection.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true };
  }

  // ─── Checklist Execution ───────────────────────────────────────────────

  async startExecution(recordType: string, recordId: string, checklistId: string, companyId: string) {
    // Verify record exists (audit or inspection)
    if (recordType === 'audit') await this.getAudit(recordId, companyId);
    else if (recordType === 'inspection') await this.getInspection(recordId, companyId);

    // Get latest published checklist version
    const checklist = await this.prisma.checklist.findUnique({ where: { id: checklistId }, include: { versions: { where: { status: 'active' }, orderBy: { version: 'desc' }, take: 1 } } });
    if (!checklist) throw new NotFoundException('Checklist not found');
    const versionId = checklist.versions[0]?.id;
    if (!versionId) throw new NotFoundException('No published version of this checklist');

    // Snapshot checklist items as execution items
    const sections = await this.prisma.checklistSection.findMany({ where: { checklistId, deletedAt: null }, include: { items: { where: { deletedAt: null }, include: { options: true } } }, orderBy: { sortOrder: 'asc' } });

    const totalMaxScore = sections.reduce((sum, s) => sum + s.items.reduce((s2, it) => s2 + (it.weight || 1), 0), 0);
    const passScore = checklist.passScore || (totalMaxScore * 0.75);

    const result = await this.prisma.checklistExecutionResult.create({
      data: { companyId, recordType, recordId, checklistId, checklistVersionId: versionId, maxScore: totalMaxScore, passScore, status: 'in_progress' },
    });

    let sortOrder = 0;
    for (const section of sections) {
      for (const item of section.items) {
        await this.prisma.checklistExecutionItem.create({
          data: { resultId: result.id, companyId, itemId: item.id, question: item.question, answerType: item.answerType, score: null, isCriticalFail: false, sortOrder: sortOrder++ },
        });
      }
    }

    return this.getExecutionResult(result.id, companyId);
  }

  async getExecutionResult(id: string, companyId: string) {
    const r = await this.prisma.checklistExecutionResult.findUnique({ where: { id }, include: { items: { orderBy: { sortOrder: 'asc' } } } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Not found');
    return r;
  }

  async answerItem(itemId: string, data: { answer?: string; score?: number; comment?: string; isCriticalFail?: boolean }, companyId: string) {
    return this.prisma.checklistExecutionItem.update({ where: { id: itemId }, data });
  }

  async completeExecution(id: string, companyId: string, userId: string) {
    const r = await this.getExecutionResult(id, companyId);
    const items = r.items;
    const totalScore = items.reduce((sum, it) => sum + (it.score || 0), 0);
    const passed = totalScore >= (r.passScore || 0);
    await this.prisma.checklistExecutionResult.update({ where: { id }, data: { totalScore, passed, status: 'completed', completedBy: userId, completedAt: new Date() } });

    // Update parent record score
    if (r.recordType === 'audit') {
      await this.prisma.audit.update({ where: { id: r.recordId }, data: { score: totalScore, passScore: r.passScore, passed } });
    } else if (r.recordType === 'inspection') {
      await this.prisma.inspection.update({ where: { id: r.recordId }, data: { score: totalScore, passScore: r.passScore, passed } });
    }

    return this.getExecutionResult(id, companyId);
  }

  // ─── Audit Execution ───────────────────────────────────────────────────

  async startAudit(id: string, companyId: string, userId: string) {
    const audit = await this.getAudit(id, companyId);
    if (audit.status !== 'planned' && audit.status !== 'scheduled') throw new NotFoundException('Audit cannot be started in current status');
    await this.prisma.audit.update({ where: { id }, data: { status: 'in_progress', startDate: new Date() } });
    await this.prisma.auditExecutionNote.create({ data: { auditId: id, companyId, content: 'Audit started', noteType: 'opening_meeting', createdBy: userId } });
    return this.getAudit(id, companyId);
  }

  async addExecutionNote(auditId: string, data: { content: string; noteType: string }, companyId: string, userId: string) {
    await this.getAudit(auditId, companyId);
    return this.prisma.auditExecutionNote.create({ data: { auditId, companyId, content: data.content, noteType: data.noteType, createdBy: userId } });
  }

  async getExecutionNotes(auditId: string, companyId: string) {
    await this.getAudit(auditId, companyId);
    return this.prisma.auditExecutionNote.findMany({ where: { auditId }, orderBy: { createdAt: 'desc' } });
  }

  async getAuditProgress(auditId: string, companyId: string) {
    const audit = await this.getAudit(auditId, companyId);
    const notes = await this.prisma.auditExecutionNote.count({ where: { auditId } });
    const executions = await this.prisma.checklistExecutionResult.findMany({ where: { recordType: 'audit', recordId: auditId } });
    const completedExec = executions.filter(e => e.status === 'completed').length;
    return {
      audit: { id: audit.id, title: audit.title, status: audit.status },
      notesCount: notes,
      checklistExecutions: executions.length,
      completedExecutions: completedExec,
      progressPercent: executions.length > 0 ? Math.round((completedExec / executions.length) * 100) : 0,
    };
  }

  async completeAudit(id: string, companyId: string, userId: string) {
    const audit = await this.getAudit(id, companyId);
    if (audit.status !== 'in_progress') throw new NotFoundException('Audit not in progress');
    await this.prisma.audit.update({ where: { id }, data: { status: 'draft_report', endDate: new Date() } });
    return this.getAudit(id, companyId);
  }

  // ─── Inspection Execution ──────────────────────────────────────────────

  async startInspection(id: string, companyId: string, userId: string) {
    const insp = await this.getInspection(id, companyId);
    if (insp.status !== 'planned') throw new NotFoundException('Inspection cannot be started');
    await this.prisma.inspection.update({ where: { id }, data: { status: 'in_progress' } });
    return this.getInspection(id, companyId);
  }

  async addInspectionNote(inspectionId: string, data: { content: string; noteType: string }, companyId: string, userId: string) {
    await this.getInspection(inspectionId, companyId);
    return this.prisma.inspectionExecutionNote.create({ data: { inspectionId, companyId, content: data.content, noteType: data.noteType, createdBy: userId } });
  }

  async getInspectionNotes(inspectionId: string, companyId: string) {
    await this.getInspection(inspectionId, companyId);
    return this.prisma.inspectionExecutionNote.findMany({ where: { inspectionId }, orderBy: { createdAt: 'desc' } });
  }

  async getInspectionProgress(id: string, companyId: string) {
    const insp = await this.getInspection(id, companyId);
    const notes = await this.prisma.inspectionExecutionNote.count({ where: { inspectionId: id } });
    const executions = await this.prisma.checklistExecutionResult.findMany({ where: { recordType: 'inspection', recordId: id } });
    const completedExec = executions.filter(e => e.status === 'completed').length;
    return { inspection: { id: insp.id, title: insp.title, status: insp.status }, notesCount: notes, checklistExecutions: executions.length, completedExecutions: completedExec, progressPercent: executions.length > 0 ? Math.round((completedExec / executions.length) * 100) : 0 };
  }

  async submitInspection(id: string, companyId: string, userId: string) {
    const insp = await this.getInspection(id, companyId);
    if (insp.status !== 'in_progress') throw new NotFoundException('Inspection not in progress');
    await this.prisma.inspection.update({ where: { id }, data: { status: 'completed', completedBy: userId, completedAt: new Date() } });
    return this.getInspection(id, companyId);
  }

  async closeInspection(id: string, companyId: string) {
    const insp = await this.getInspection(id, companyId);
    if (insp.status === 'closed') throw new NotFoundException('Already closed');
    await this.prisma.inspection.update({ where: { id }, data: { status: 'closed' } });
    return { success: true, id };
  }

  // ─── Findings & Nonconformity ──────────────────────────────────────────

  async createFinding(data: any, companyId: string, userId: string) {
    return this.prisma.finding.create({ data: { ...data, companyId, raisedBy: userId } });
  }

  async getFindings(companyId: string, recordType?: string, recordId?: string) {
    const where: any = { companyId };
    if (recordType) where.recordType = recordType;
    if (recordId) where.recordId = recordId;
    return this.prisma.finding.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async getFinding(id: string, companyId: string) {
    const f = await this.prisma.finding.findUnique({ where: { id } });
    if (!f || f.companyId !== companyId) throw new NotFoundException('Not found');
    return f;
  }

  async updateFinding(id: string, data: any, companyId: string) {
    await this.getFinding(id, companyId);
    return this.prisma.finding.update({ where: { id }, data });
  }

  async assignFinding(id: string, assignedTo: string, companyId: string, userId: string) {
    await this.getFinding(id, companyId);
    return this.prisma.finding.update({ where: { id }, data: { assignedTo, status: 'action_assigned' } });
  }

  async closeFinding(id: string, companyId: string, userId: string) {
    await this.getFinding(id, companyId);
    return this.prisma.finding.update({ where: { id }, data: { status: 'closed', closedBy: userId, closedAt: new Date() } });
  }

  // ─── Corrective Action & Verification ──────────────────────────────────

  async linkActionToFinding(findingId: string, actionId: string, actionType: string, companyId: string) {
    await this.getFinding(findingId, companyId);
    return this.prisma.findingAction.create({ data: { findingId, actionId, companyId, actionType: actionType || 'corrective' } });
  }

  async getFindingActions(findingId: string, companyId: string) {
    const links = await this.prisma.findingAction.findMany({ where: { findingId, companyId } });
    const actionIds = links.map(l => l.actionId);
    const actions = actionIds.length > 0 ? await this.prisma.action.findMany({ where: { id: { in: actionIds } } }) : [];
    return { links, actions };
  }

  async verifyFinding(findingId: string, data: { verifiedBy: string; status: string; notes?: string }, companyId: string) {
    await this.getFinding(findingId, companyId);
    await this.prisma.findingVerification.create({ data: { findingId, companyId, verifiedBy: data.verifiedBy, status: data.status, notes: data.notes } });
    await this.prisma.finding.update({ where: { id: findingId }, data: { status: data.status === 'rejected' ? 'reopened' : 'verified' } });
    return { verified: data.status === 'verified', findingId };
  }

  async getFindingVerifications(findingId: string, companyId: string) {
    return this.prisma.findingVerification.findMany({ where: { findingId }, orderBy: { verifiedAt: 'desc' } });
  }

  // ─── Scoring & Rating ──────────────────────────────────────────────────

  async calculateScore(recordType: string, recordId: string, companyId: string, userId: string) {
    const executions = await this.prisma.checklistExecutionResult.findMany({ where: { recordType, recordId, companyId, status: 'completed' } });
    if (executions.length === 0) return { score: 0, maxScore: 0, percentage: 0, rating: 'N/A' };

    const totalScore = executions.reduce((sum, e) => sum + (e.totalScore || 0), 0);
    const maxScore = executions.reduce((sum, e) => sum + (e.maxScore || 0), 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    let rating = 'Critical';
    if (percentage >= 90) rating = 'Excellent';
    else if (percentage >= 75) rating = 'Good';
    else if (percentage >= 50) rating = 'Average';
    else if (percentage >= 25) rating = 'Poor';

    await this.prisma.auditInspectionScore.create({
      data: { companyId, recordType, recordId, score: totalScore, maxScore, percentage, rating, calculatedBy: userId },
    });

    return { score: totalScore, maxScore, percentage, rating };
  }

  async getScores(companyId: string, recordType?: string, recordId?: string) {
    const where: any = { companyId };
    if (recordType) where.recordType = recordType;
    if (recordId) where.recordId = recordId;
    return this.prisma.auditInspectionScore.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async getComplianceSummary(companyId: string) {
    const audits = await this.prisma.audit.count({ where: { companyId, deletedAt: null } });
    const completedAudits = await this.prisma.audit.count({ where: { companyId, deletedAt: null, status: { in: ['final', 'closed'] } } });
    const inspections = await this.prisma.inspection.count({ where: { companyId, deletedAt: null } });
    const completedInspections = await this.prisma.inspection.count({ where: { companyId, deletedAt: null, status: { in: ['completed', 'closed'] } } });
    const openFindings = await this.prisma.finding.count({ where: { companyId, status: { notIn: ['closed'] } } });
    const scores = await this.prisma.auditInspectionScore.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 10 });
    return { audits: { total: audits, completed: completedAudits }, inspections: { total: inspections, completed: completedInspections }, openFindings, recentScores: scores };
  }

  // ─── Reports & Approval ────────────────────────────────────────────────

  async generateAuditReport(auditId: string, companyId: string, userId: string) {
    const audit = await this.getAudit(auditId, companyId);
    const notes = await this.prisma.auditExecutionNote.findMany({ where: { auditId }, orderBy: { createdAt: 'asc' } });
    const executions = await this.prisma.checklistExecutionResult.findMany({ where: { recordType: 'audit', recordId: auditId } });
    const findings = await this.prisma.finding.findMany({ where: { recordType: 'audit', recordId: auditId } });
    const scores = await this.prisma.auditInspectionScore.findMany({ where: { recordType: 'audit', recordId: auditId }, orderBy: { createdAt: 'desc' }, take: 1 });

    const content = { audit: { id: audit.id, title: audit.title, status: audit.status }, notes: notes.length, executions: executions.length, findings: findings.length, findingsList: findings, latestScore: scores[0] || null, generatedAt: new Date().toISOString() };

    return this.prisma.auditReport.upsert({
      where: { auditId },
      create: { auditId, companyId, content, generatedBy: userId },
      update: { content, generatedBy: userId, status: 'draft' },
    });
  }

  async getAuditReport(auditId: string, companyId: string) {
    const r = await this.prisma.auditReport.findUnique({ where: { auditId } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Report not found');
    return r;
  }

  async generateInspectionReport(inspectionId: string, companyId: string, userId: string) {
    const insp = await this.getInspection(inspectionId, companyId);
    const notes = await this.prisma.inspectionExecutionNote.findMany({ where: { inspectionId }, orderBy: { createdAt: 'asc' } });
    const executions = await this.prisma.checklistExecutionResult.findMany({ where: { recordType: 'inspection', recordId: inspectionId } });
    const findings = await this.prisma.finding.findMany({ where: { recordType: 'inspection', recordId: inspectionId } });
    const scores = await this.prisma.auditInspectionScore.findMany({ where: { recordType: 'inspection', recordId: inspectionId }, orderBy: { createdAt: 'desc' }, take: 1 });

    const content = { inspection: { id: insp.id, title: insp.title, status: insp.status }, notes: notes.length, executions: executions.length, findings: findings.length, findingsList: findings, latestScore: scores[0] || null, generatedAt: new Date().toISOString() };

    return this.prisma.inspectionReport.upsert({
      where: { inspectionId },
      create: { inspectionId, companyId, content, generatedBy: userId },
      update: { content, generatedBy: userId, status: 'draft' },
    });
  }

  async getInspectionReport(inspectionId: string, companyId: string) {
    const r = await this.prisma.inspectionReport.findUnique({ where: { inspectionId } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Report not found');
    return r;
  }

  async submitReport(reportId: string, companyId: string) {
    const r = await this.prisma.auditReport.findUnique({ where: { id: reportId } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Report not found');
    return this.prisma.auditReport.update({ where: { id: reportId }, data: { status: 'submitted' } });
  }

  async approveReport(reportId: string, companyId: string, userId: string) {
    const r = await this.prisma.auditReport.findUnique({ where: { id: reportId } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Report not found');
    return this.prisma.auditReport.update({ where: { id: reportId }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
  }

  async rejectReport(reportId: string, companyId: string) {
    const r = await this.prisma.auditReport.findUnique({ where: { id: reportId } });
    if (!r || r.companyId !== companyId) throw new NotFoundException('Report not found');
    return this.prisma.auditReport.update({ where: { id: reportId }, data: { status: 'rejected' } });
  }

  // ─── Dashboard & KPI ────────────────────────────────────────────────────

  async getDashboard(companyId: string) {
    const [totalAudits, completedAudits, totalInspections, completedInspections, openFindings, overdueFindings, majorNc, minorNc] = await Promise.all([
      this.prisma.audit.count({ where: { companyId, deletedAt: null } }),
      this.prisma.audit.count({ where: { companyId, deletedAt: null, status: { in: ['final', 'closed'] } } }),
      this.prisma.inspection.count({ where: { companyId, deletedAt: null } }),
      this.prisma.inspection.count({ where: { companyId, deletedAt: null, status: { in: ['completed', 'closed'] } } }),
      this.prisma.finding.count({ where: { companyId, status: { not: 'closed' } } }),
      this.prisma.finding.count({ where: { companyId, status: { not: 'closed' }, dueDate: { lt: new Date() } } }),
      this.prisma.finding.count({ where: { companyId, severityId: { in: ['critical', 'major'] } } }),
      this.prisma.finding.count({ where: { companyId, severityId: 'minor' } }),
    ]);

    const bySeverity = await this.prisma.finding.groupBy({ by: ['severityId'], where: { companyId }, _count: true, orderBy: { _count: { id: 'desc' } } });
    const byAuditStatus = await this.prisma.audit.groupBy({ by: ['status'], where: { companyId, deletedAt: null }, _count: true });
    const recentScores = await this.prisma.auditInspectionScore.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' }, take: 10 });

    return { audits: { total: totalAudits, completed: completedAudits }, inspections: { total: totalInspections, completed: completedInspections }, findings: { open: openFindings, overdue: overdueFindings, majorNc, minorNc, bySeverity: bySeverity.map(s => ({ severity: s.severityId, count: s._count })) }, byAuditStatus: byAuditStatus.map(s => ({ status: s.status, count: s._count })), recentScores };
  }

  async getKpi(companyId: string, year?: number) {
    const y = year || new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    const [audits, inspections, findings, closedFindings] = await Promise.all([
      this.prisma.audit.count({ where: { companyId, deletedAt: null, createdAt: { gte: start, lt: end } } }),
      this.prisma.inspection.count({ where: { companyId, deletedAt: null, createdAt: { gte: start, lt: end } } }),
      this.prisma.finding.count({ where: { companyId, createdAt: { gte: start, lt: end } } }),
      this.prisma.finding.count({ where: { companyId, createdAt: { gte: start, lt: end }, status: 'closed' } }),
    ]);
    const closeRate = findings > 0 ? Math.round((closedFindings / findings) * 100) : 0;
    return { year: y, audits, inspections, findings, closedFindings, closeOutRate: closeRate };
  }

  async getTrends(companyId: string) {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const [auditCount, findingCount] = await Promise.all([
        this.prisma.audit.count({ where: { companyId, deletedAt: null, createdAt: { gte: start, lt: end } } }),
        this.prisma.finding.count({ where: { companyId, createdAt: { gte: start, lt: end } } }),
      ]);
      months.push({ month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`, audits: auditCount, findings: findingCount });
    }
    return { trends: months };
  }
}
