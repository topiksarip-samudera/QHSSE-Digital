import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateFormDto, UpdateFormDto, FormQueryDto, SubmitFormDto } from './dto/form-builder.dto';

@Injectable()
export class FormBuilderService {
  constructor(private prisma: PrismaService) {}

  // ─── Form CRUD ──────────────────────────────────────────────────────────────

  async create(dto: CreateFormDto, companyId: string, userId: string) {
    const form = await this.prisma.form.create({
      data: { companyId, name: dto.name, description: dto.description, createdBy: userId, status: Status.draft },
    });

    if (dto.sections) {
      await this.createSections(form.id, dto.sections);
    }

    return this.getFormDetail(form.id, companyId);
  }

  async findAll(companyId: string, query: FormQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.form.findMany({
        where,
        include: { _count: { select: { sections: true, submissions: true } } },
        orderBy: { createdAt: 'desc' }, skip, take: limit,
      }),
      this.prisma.form.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getFormDetail(id: string, companyId: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        sections: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            fields: {
              where: { deletedAt: null },
              orderBy: { sortOrder: 'asc' },
              include: { options: { orderBy: { sortOrder: 'asc' } }, conditions: true },
            },
          },
        },
        versions: { orderBy: { version: 'desc' }, take: 5 },
      },
    });
    if (!form) throw new NotFoundException('Form not found');
    if (form.companyId !== companyId) throw new ForbiddenException('Access denied');
    return form;
  }

  async update(id: string, dto: UpdateFormDto, companyId: string, userId: string) {
    const form = await this.getFormDetail(id, companyId);
    if (form.status === Status.active) throw new BadRequestException('Cannot edit published form. Clone and create new version instead.');

    await this.prisma.form.update({
      where: { id },
      data: { name: dto.name ?? form.name, description: dto.description !== undefined ? dto.description : form.description, updatedBy: userId },
    });

    if (dto.sections) {
      await this.prisma.formSection.updateMany({ where: { formId: id }, data: { deletedAt: new Date() } });
      await this.createSections(id, dto.sections);
    }

    return this.getFormDetail(id, companyId);
  }

  async softDelete(id: string, companyId: string) {
    await this.getFormDetail(id, companyId);
    await this.prisma.form.update({ where: { id }, data: { deletedAt: new Date(), status: Status.archived } });
    return { success: true, id };
  }

  async publish(id: string, companyId: string, userId: string) {
    const form = await this.getFormDetail(id, companyId);
    if (form.status === Status.active) throw new BadRequestException('Form already published');

    // Create version snapshot
    const definition = {
      sections: form.sections.map((s) => ({
        title: s.title,
        sortOrder: s.sortOrder,
        fields: s.fields.map((f) => ({
          label: f.label, key: f.key, type: f.type, required: f.required,
          placeholder: f.placeholder, helpText: f.helpText, defaultValue: f.defaultValue,
          sortOrder: f.sortOrder, repeatable: f.repeatable,
          options: f.options.map((o) => ({ label: o.label, value: o.value, sortOrder: o.sortOrder })),
          conditions: f.conditions.map((c) => ({ dependsOnFieldId: c.dependsOnFieldId, operator: c.operator, value: c.value, action: c.action, actionValue: c.actionValue })),
        })),
      })),
    };

    const newVersion = form.version + 1;
    await this.prisma.formVersion.create({
      data: { formId: id, companyId, version: newVersion, definition, status: Status.active, publishedBy: userId, publishedAt: new Date() },
    });

    await this.prisma.form.update({ where: { id }, data: { status: Status.active, version: newVersion } });

    return this.getFormDetail(id, companyId);
  }

  async clone(id: string, companyId: string, userId: string) {
    const form = await this.getFormDetail(id, companyId);

    const clone = await this.prisma.form.create({
      data: { companyId, name: `${form.name} (Copy)`, description: form.description, status: Status.draft, createdBy: userId },
    });

    const sectionDtos = form.sections.map((s) => ({
      title: s.title, sortOrder: s.sortOrder,
      fields: s.fields.map((f) => ({
        label: f.label, key: f.key, type: f.type, required: f.required,
        placeholder: f.placeholder, helpText: f.helpText, defaultValue: f.defaultValue,
        sortOrder: f.sortOrder, repeatable: f.repeatable,
        options: f.options.map((o) => ({ label: o.label, value: o.value, sortOrder: o.sortOrder })),
        conditions: f.conditions.map((c) => ({ dependsOnFieldId: c.dependsOnFieldId, operator: c.operator, value: c.value, action: c.action, actionValue: c.actionValue })),
      })),
    }));
    await this.createSections(clone.id, sectionDtos as any);

    return this.getFormDetail(clone.id, companyId);
  }

  // ─── Submission ─────────────────────────────────────────────────────────────

  async submit(dto: SubmitFormDto, companyId: string, userId: string) {
    const version = await this.prisma.formVersion.findUnique({ where: { id: dto.formVersionId } });
    if (!version) throw new NotFoundException('Form version not found');

    const submission = await this.prisma.formSubmission.create({
      data: { formId: version.formId, formVersionId: dto.formVersionId, companyId, submittedBy: userId, status: 'submitted' },
    });

    if (dto.values) {
      for (const [fieldId, value] of Object.entries(dto.values)) {
        await this.prisma.formSubmissionValue.create({
          data: { submissionId: submission.id, fieldId, value: typeof value === 'string' ? value : JSON.stringify(value) },
        });
      }
    }

    return { id: submission.id, formId: version.formId, formVersionId: dto.formVersionId, status: 'submitted', submittedAt: submission.submittedAt };
  }

  async getSubmissions(formId: string, companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.formSubmission.findMany({
        where: { formId, companyId, deletedAt: null },
        include: { values: true, version: { select: { version: true } } },
        orderBy: { submittedAt: 'desc' }, skip, take: limit,
      }),
      this.prisma.formSubmission.count({ where: { formId, companyId, deletedAt: null } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getSubmissionDetail(id: string, companyId: string) {
    const sub = await this.prisma.formSubmission.findUnique({
      where: { id },
      include: { values: true, version: true },
    });
    if (!sub) throw new NotFoundException('Submission not found');
    if (sub.companyId !== companyId) throw new ForbiddenException('Access denied');
    return sub;
  }

  // ─── Internal helpers ──────────────────────────────────────────────────────

  private async createSections(formId: string, sections: Array<{ title: string; sortOrder?: number; fields?: any[] }>) {
    for (let si = 0; si < sections.length; si++) {
      const s = sections[si];
      const section = await this.prisma.formSection.create({
        data: { formId, title: s.title, sortOrder: s.sortOrder ?? si },
      });
      if (s.fields) {
        for (let fi = 0; fi < s.fields.length; fi++) {
          const f = s.fields[fi];
          const createdField = await this.prisma.formField.create({
            data: {
              sectionId: section.id, label: f.label, key: f.key, type: f.type,
              required: f.required ?? false, placeholder: f.placeholder, helpText: f.helpText,
              defaultValue: f.defaultValue, sortOrder: f.sortOrder ?? fi,
              repeatable: f.repeatable ?? false, minLength: f.minLength, maxLength: f.maxLength,
              minValue: f.minValue, maxValue: f.maxValue, formula: f.formula,
            },
          });
          if (f.options) {
            for (let oi = 0; oi < f.options.length; oi++) {
              const o = f.options[oi];
              await this.prisma.formFieldOption.create({
                data: { fieldId: createdField.id, label: o.label, value: o.value, sortOrder: o.sortOrder ?? oi },
              });
            }
          }
          if (f.conditions) {
            for (const c of f.conditions) {
              await this.prisma.formCondition.create({
                data: { fieldId: createdField.id, dependsOnFieldId: c.dependsOnFieldId, operator: c.operator, value: c.value, action: c.action, actionValue: c.actionValue },
              });
            }
          }
        }
      }
    }
  }
}
