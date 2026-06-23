import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermitService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: string, userId: string) {
    const permit = await this.prisma.permit.create({
      data: {
        companyId, permitTypeId: data.permitTypeId, title: data.title, description: data.description,
        siteId: data.siteId, department: data.department, area: data.area,
        workMethod: data.workMethod, jobDescription: data.jobDescription, contractorName: data.contractorName,
        startDate: data.startDate ? new Date(data.startDate) : null, endDate: data.endDate ? new Date(data.endDate) : null,
        applicantId: userId, supervisorId: data.supervisorId, createdBy: userId,
      },
    });
    if (data.locations) for (const loc of data.locations) await this.prisma.permitWorkLocation.create({ data: { permitId: permit.id, companyId, name: loc.name || loc, description: loc.description } });
    if (data.workers) for (const w of data.workers) await this.prisma.permitWorker.create({ data: { permitId: permit.id, companyId, userId: w.userId, fullName: w.fullName || w, role: w.role || 'performer' } });
    return this.findOne(permit.id, companyId);
  }

  async findAll(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.status) where.status = query.status;
    if (query?.permitTypeId) where.permitTypeId = query.permitTypeId;
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.permit.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async findOne(id: string, companyId: string) {
    const permit = await this.prisma.permit.findUnique({ where: { id }, include: { locations: true, workers: true } });
    if (!permit || permit.companyId !== companyId) throw new NotFoundException('Permit not found');
    return permit;
  }

  async update(id: string, data: any, companyId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'draft') throw new ForbiddenException('Only draft permits can be edited');
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.prisma.permit.update({ where: { id }, data });
  }

  async softDelete(id: string, companyId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'draft') throw new ForbiddenException('Only drafts can be deleted');
    await this.prisma.permit.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
    return { success: true };
  }

  async submit(id: string, companyId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'draft') throw new ForbiddenException('Only drafts can be submitted');
    return this.prisma.permit.update({ where: { id }, data: { status: 'submitted' } });
  }

  async addLocation(permitId: string, data: { name: string; description?: string }, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitWorkLocation.create({ data: { permitId, companyId, name: data.name, description: data.description } });
  }

  async addWorker(permitId: string, data: { fullName: string; role?: string; userId?: string }, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitWorker.create({ data: { permitId, companyId, fullName: data.fullName, role: data.role || 'performer', userId: data.userId } });
  }

  async removeWorker(id: string) {
    await this.prisma.permitWorker.delete({ where: { id } });
    return { success: true };
  }

  // ─── JSA & Risk Links ──────────────────────────────────────────────────

  async linkJsa(permitId: string, jsaId: string, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitJsaLink.create({ data: { permitId, jsaId, companyId } });
  }

  async linkRisk(permitId: string, riskId: string, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitRiskLink.create({ data: { permitId, riskId, companyId } });
  }

  async getLinkedItems(permitId: string, companyId: string) {
    const [jsaLinks, riskLinks] = await Promise.all([
      this.prisma.permitJsaLink.findMany({ where: { permitId, companyId } }),
      this.prisma.permitRiskLink.findMany({ where: { permitId, companyId } }),
    ]);
    return { jsaLinks, riskLinks };
  }

  async unlinkJsa(linkId: string, companyId: string) {
    const link = await this.prisma.permitJsaLink.findUnique({ where: { id: linkId } });
    if (!link || link.companyId !== companyId) throw new ForbiddenException('Access denied');
    await this.prisma.permitJsaLink.delete({ where: { id: linkId } });
    return { success: true };
  }

  async unlinkRisk(linkId: string, companyId: string) {
    const link = await this.prisma.permitRiskLink.findUnique({ where: { id: linkId } });
    if (!link || link.companyId !== companyId) throw new ForbiddenException('Access denied');
    await this.prisma.permitRiskLink.delete({ where: { id: linkId } });
    return { success: true };
  }

  // ─── PPE, Tools & Equipment ────────────────────────────────────────────

  async addPpe(permitId: string, data: { ppeType: string; quantity?: number; notes?: string }, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitPpeRequirement.create({ data: { permitId, companyId, ...data } });
  }

  async addTool(permitId: string, data: { toolName: string; quantity?: number; certified?: boolean; notes?: string }, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitToolRequirement.create({ data: { permitId, companyId, ...data } });
  }

  async addEquipment(permitId: string, data: { equipmentName: string; assetId?: string; quantity?: number; certified?: boolean; notes?: string }, companyId: string) {
    await this.findOne(permitId, companyId);
    return this.prisma.permitEquipmentRequirement.create({ data: { permitId, companyId, ...data } });
  }

  async getPpeToolsEquipment(permitId: string, companyId: string) {
    const [ppe, tools, equipment] = await Promise.all([
      this.prisma.permitPpeRequirement.findMany({ where: { permitId } }),
      this.prisma.permitToolRequirement.findMany({ where: { permitId } }),
      this.prisma.permitEquipmentRequirement.findMany({ where: { permitId } }),
    ]);
    return { ppe, tools, equipment };
  }

  async removePpe(id: string) { await this.prisma.permitPpeRequirement.delete({ where: { id } }); return { success: true }; }
  async removeTool(id: string) { await this.prisma.permitToolRequirement.delete({ where: { id } }); return { success: true }; }
  async removeEquipment(id: string) { await this.prisma.permitEquipmentRequirement.delete({ where: { id } }); return { success: true }; }

  // ─── Competency, Gas Test, LOTO, SIMOPS ─────────────────────────────

  async addCompetency(permitId: string, data: any, companyId: string) { await this.findOne(permitId, companyId); return this.prisma.permitCompetencyCheck.create({ data: { permitId, companyId, ...data } }); }
  async addGasTest(permitId: string, data: any, companyId: string) { await this.findOne(permitId, companyId); return this.prisma.permitGasTest.create({ data: { permitId, companyId, ...data } }); }
  async addLotoPoint(permitId: string, data: any, companyId: string) { await this.findOne(permitId, companyId); return this.prisma.permitLotoPoint.create({ data: { permitId, companyId, ...data } }); }
  async addSimopsCheck(permitId: string, data: any, companyId: string) { await this.findOne(permitId, companyId); return this.prisma.permitSimopsCheck.create({ data: { permitId, companyId, ...data } }); }

  async getSafetyChecks(permitId: string, companyId: string) {
    const [competency, gasTests, loto, simops] = await Promise.all([
      this.prisma.permitCompetencyCheck.findMany({ where: { permitId } }),
      this.prisma.permitGasTest.findMany({ where: { permitId } }),
      this.prisma.permitLotoPoint.findMany({ where: { permitId } }),
      this.prisma.permitSimopsCheck.findMany({ where: { permitId } }),
    ]);
    return { competency, gasTests, loto, simops };
  }

  // ─── Workflow: Approve, Activate, Extend, Suspend ─────────────────────

  async approve(id: string, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (!['submitted', 'under_review'].includes(permit.status)) throw new ForbiddenException('Cannot approve in current status');
    await this.prisma.permit.update({ where: { id }, data: { status: 'approved', approverId: userId, approvedAt: new Date() } });
    return this.findOne(id, companyId);
  }

  async activate(id: string, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'approved') throw new ForbiddenException('Only approved permits can be activated');
    await this.prisma.permit.update({ where: { id }, data: { status: 'active', activatedAt: new Date(), issuerId: userId } });
    return this.findOne(id, companyId);
  }

  async extend(id: string, data: { reason?: string; newEndDate: string }, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (!['approved', 'active'].includes(permit.status)) throw new ForbiddenException('Cannot extend in current status');
    const newEnd = new Date(data.newEndDate);
    await this.prisma.permit.update({ where: { id }, data: { endDate: newEnd, status: 'extended' } });
    await this.prisma.permitExtension.create({ data: { permitId: id, companyId, reason: data.reason, oldEndDate: permit.endDate || new Date(), newEndDate: newEnd, requestedBy: userId, status: 'approved', approvedBy: userId, approvedAt: new Date() } });
    return this.findOne(id, companyId);
  }

  async suspend(id: string, data: { reason?: string }, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'active') throw new ForbiddenException('Only active permits can be suspended');
    await this.prisma.permit.update({ where: { id }, data: { status: 'suspended', suspendedAt: new Date() } });
    await this.prisma.permitSuspension.create({ data: { permitId: id, companyId, reason: data.reason, suspendedBy: userId } });
    return this.findOne(id, companyId);
  }

  async resume(id: string, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (permit.status !== 'suspended') throw new ForbiddenException('Only suspended permits can be resumed');
    // Close active suspension record
    const activeSusp = await this.prisma.permitSuspension.findFirst({ where: { permitId: id, status: 'active' } });
    if (activeSusp) await this.prisma.permitSuspension.update({ where: { id: activeSusp.id }, data: { status: 'resolved', resumedBy: userId, resumedAt: new Date() } });
    await this.prisma.permit.update({ where: { id }, data: { status: 'active' } });
    return this.findOne(id, companyId);
  }

  async close(id: string, companyId: string, userId: string) {
    const permit = await this.findOne(id, companyId);
    if (['closed', 'cancelled'].includes(permit.status)) throw new ForbiddenException('Already closed');
    await this.prisma.permit.update({ where: { id }, data: { status: 'closed', closedAt: new Date() } });
    return { success: true, id };
  }

  // ─── Closeout & Handover ───────────────────────────────────────────────

  async completeCloseout(permitId: string, data: any, companyId: string, userId: string) {
    return this.prisma.permitCloseout.upsert({
      where: { permitId },
      create: { permitId, companyId, completedBy: userId, ...data },
      update: { ...data, completedBy: userId, completedAt: new Date() },
    });
  }

  async getCloseout(permitId: string, companyId: string) {
    const c = await this.prisma.permitCloseout.findUnique({ where: { permitId } });
    if (!c || c.companyId !== companyId) throw new NotFoundException('Closeout not found');
    return c;
  }

  async getDashboard(companyId: string) {
    const [total, active, suspended, closed] = await Promise.all([
      this.prisma.permit.count({ where: { companyId, deletedAt: null } }),
      this.prisma.permit.count({ where: { companyId, deletedAt: null, status: { in: ['approved', 'active', 'extended'] } } }),
      this.prisma.permit.count({ where: { companyId, deletedAt: null, status: 'suspended' } }),
      this.prisma.permit.count({ where: { companyId, deletedAt: null, status: 'closed' } }),
    ]);
    const byType = await this.prisma.permit.groupBy({ by: ['permitTypeId'], where: { companyId, deletedAt: null }, _count: true });
    return { total, active, suspended, closed, byType: byType.map(t => ({ type: t.permitTypeId, count: t._count })) };
  }
}
