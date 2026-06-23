import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExportDto, ImportQueryDto } from './dto/import-export.dto';

@Injectable()
export class ImportExportService {
  constructor(private prisma: PrismaService) {}

  async uploadImport(file: Express.Multer.File, moduleCode: string, companyId: string, userId: string) {
    const csv = file.buffer.toString('utf-8');
    const lines = csv.split('\n').filter((l: string) => l.trim());
    if (lines.length < 2) return { error: 'Empty file or missing header' };
    const headers = lines[0].split(',').map((h: string) => h.trim());
    const rows = lines.slice(1).map((line: string) => {
      const values = line.split(',').map((v: string) => v.trim());
      const data: Record<string, string> = {};
      headers.forEach((h: string, i: number) => { data[h] = values[i] || ''; });
      return { data, status: 'pending', errors: null };
    });

    const job = await this.prisma.importJob.create({
      data: { companyId, moduleCode, fileName: file.originalname, totalRows: rows.length, createdBy: userId, status: 'preview' },
    });
    for (let i = 0; i < rows.length; i++) {
      await this.prisma.importJobRow.create({ data: { jobId: job.id, rowIndex: i, data: rows[i].data, status: rows[i].status } });
    }
    return { ...job, rows: rows.length };
  }

  async getImportPreview(id: string, companyId: string) {
    const job = await this.prisma.importJob.findUnique({ where: { id }, include: { rows: { orderBy: { rowIndex: 'asc' }, take: 50 } } });
    if (!job || job.companyId !== companyId) throw new NotFoundException('Not found');
    return job;
  }

  async commitImport(id: string, companyId: string) {
    const job = await this.prisma.importJob.findUnique({ where: { id } });
    if (!job || job.companyId !== companyId) throw new NotFoundException('Not found');
    let success = 0, errors = 0;
    const rows = await this.prisma.importJobRow.findMany({ where: { jobId: id } });
    for (const row of rows) {
      try {
        const rowErrors: string[] = [];
        if (!(row.data as any).name && !(row.data as any).title) rowErrors.push('Missing name/title');
        if (rowErrors.length > 0) {
          await this.prisma.importJobRow.update({ where: { id: row.id }, data: { status: 'error', errors: rowErrors } });
          errors++;
        } else {
          await this.prisma.importJobRow.update({ where: { id: row.id }, data: { status: 'imported' } });
          success++;
        }
      } catch {
        await this.prisma.importJobRow.update({ where: { id: row.id }, data: { status: 'error', errors: ['Unknown error'] } });
        errors++;
      }
    }
    await this.prisma.importJob.update({ where: { id }, data: { status: 'committed', successRows: success, errorRows: errors } });
    return { success, errors, total: rows.length };
  }

  async getImportHistory(companyId: string, query: ImportQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId };
    if (query.moduleCode) where.moduleCode = query.moduleCode;
    if (query.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.importJob.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.importJob.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createExport(dto: CreateExportDto, companyId: string, userId: string) {
    const job = await this.prisma.exportJob.create({
      data: { companyId, moduleCode: dto.moduleCode, format: dto.format || 'csv', createdBy: userId, status: 'completed', fileName: `${dto.moduleCode}-export-${Date.now()}.${dto.format || 'csv'}` },
    });
    await this.prisma.exportLog.create({ data: { exportId: job.id, action: 'create', performedBy: userId } });
    return job;
  }

  async getExportHistory(companyId: string, query: ImportQueryDto) {
    const page = query.page || 1; const limit = query.limit || 20; const skip = (page - 1) * limit;
    const where: any = { companyId };
    if (query.moduleCode) where.moduleCode = query.moduleCode;
    if (query.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.exportJob.findMany({ where, include: { logs: { take: 1, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.exportJob.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
