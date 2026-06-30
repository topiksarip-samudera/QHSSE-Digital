import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentWasteService {
  constructor(private prisma: PrismaService) {}

  async createWaste(data: any, companyId: string, userId: string) {
    return this.prisma.environmentWasteRecord.create({
      data: { companyId, title: data.title, description: data.description, wasteTypeId: data.wasteTypeId, wasteCategoryId: data.wasteCategoryId, quantity: data.quantity || 0, unit: data.unit, disposalMethod: data.disposalMethod, disposalSite: data.disposalSite, collectorName: data.collectorName, collectionDate: data.collectionDate ? new Date(data.collectionDate) : null, wasteDate: data.wasteDate ? new Date(data.wasteDate) : null, responsibleId: data.responsibleId, createdBy: userId },
    });
  }

  async getWasteRecords(companyId: string, query?: any) {
    const where: any = { companyId, deletedAt: null };
    if (query?.status) where.status = query.status;
    if (query?.search) where.title = { contains: query.search, mode: 'insensitive' };
    return this.prisma.environmentWasteRecord.findMany({ where, include: { manifests: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async findOne(id: string, companyId: string) {
    const w = await this.prisma.environmentWasteRecord.findUnique({ where: { id }, include: { manifests: true } });
    if (!w || w.companyId !== companyId) throw new NotFoundException('Waste record not found');
    return w;
  }

  async updateWaste(id: string, data: any, companyId: string) { await this.findOne(id, companyId); return this.prisma.environmentWasteRecord.update({ where: { id }, data }); }
  async softDelete(id: string, companyId: string) { await this.prisma.environmentWasteRecord.update({ where: { id }, data: { deletedAt: new Date() } }); return { success: true }; }

  async createManifest(wasteRecordId: string, data: any, companyId: string, userId: string) {
    await this.findOne(wasteRecordId, companyId);
    return this.prisma.environmentWasteManifest.create({ data: { wasteRecordId, companyId, manifestNumber: data.manifestNumber, transporterName: data.transporterName, vehicleNumber: data.vehicleNumber, destination: data.destination, status: 'pending', createdBy: userId } });
  }

  async updateManifest(id: string, data: any) { return this.prisma.environmentWasteManifest.update({ where: { id }, data }); }
}
