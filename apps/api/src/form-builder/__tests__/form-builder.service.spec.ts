import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormBuilderService } from '../form-builder.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';

const mockPrisma = {
  form: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  formSection: { create: vi.fn(), updateMany: vi.fn() },
  formField: { create: vi.fn() },
  formFieldOption: { create: vi.fn() },
  formCondition: { create: vi.fn() },
  formVersion: { create: vi.fn(), findUnique: vi.fn() },
  formSubmission: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  formSubmissionValue: { create: vi.fn() },
};

function makeForm(overrides: any = {}) {
  return { id: 'f-1', companyId: 'comp-1', name: 'Test Form', description: 'Desc', status: 'draft', version: 1, createdBy: 'user-1', updatedBy: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null, sections: [], versions: [], _count: { sections: 0, submissions: 0 }, ...overrides };
}

describe('FormBuilderService', () => {
  let service: FormBuilderService;
  beforeEach(() => { vi.clearAllMocks(); service = new FormBuilderService(mockPrisma as any); });

  describe('create', () => {
    it('should create a form', async () => {
      mockPrisma.form.create.mockResolvedValue(makeForm());
      mockPrisma.form.findUnique.mockResolvedValue(makeForm());
      const result = await service.create({ name: 'Test' }, 'comp-1', 'user-1');
      expect(result.name).toBe('Test Form');
    });
  });

  describe('findAll', () => {
    it('should return paginated forms', async () => {
      mockPrisma.form.findMany.mockResolvedValue([makeForm()]);
      mockPrisma.form.count.mockResolvedValue(1);
      const result = await service.findAll('comp-1', {});
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getFormDetail', () => {
    it('should return form with relations', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(makeForm());
      const result = await service.getFormDetail('f-1', 'comp-1');
      expect(result.id).toBe('f-1');
    });
    it('should throw if not found', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(null);
      await expect(service.getFormDetail('f-999', 'comp-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a draft form', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(makeForm({ status: Status.draft }));
      mockPrisma.form.update.mockResolvedValue({});
      mockPrisma.formSection.updateMany.mockResolvedValue({ count: 0 });
      const updated = makeForm({ name: 'Updated', status: Status.draft });
      (mockPrisma.form.findUnique as any).mockResolvedValueOnce(makeForm({ status: Status.draft }));
      (mockPrisma.form.findUnique as any).mockResolvedValueOnce(updated);
      const result = await service.update('f-1', { name: 'Updated' }, 'comp-1', 'user-1');
      expect(result.name).toBe('Updated');
    });
    it('should reject update on published form', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(makeForm({ status: Status.active }));
      await expect(service.update('f-1', { name: 'X' }, 'comp-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('publish', () => {
    it('should publish and create version', async () => {
      const draftForm = makeForm({ status: Status.draft, sections: [], versions: [] });
      const publishedForm = makeForm({ status: Status.active, sections: [], versions: [] });
      (mockPrisma.form.findUnique as any)
        .mockResolvedValueOnce(draftForm)
        .mockResolvedValueOnce(publishedForm);
      mockPrisma.formVersion.create.mockResolvedValue({ id: 'v-1', version: 2 });
      mockPrisma.form.update.mockResolvedValue({});
      const result = await service.publish('f-1', 'comp-1', 'user-1');
      expect(mockPrisma.formVersion.create).toHaveBeenCalled();
    });
  });

  describe('clone', () => {
    it('should clone a form', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(makeForm());
      mockPrisma.form.create.mockResolvedValue(makeForm({ id: 'f-2', name: 'Test Form (Copy)' }));
      mockPrisma.form.findUnique.mockResolvedValue(makeForm({ id: 'f-2', name: 'Test Form (Copy)' }));
      const result = await service.clone('f-1', 'comp-1', 'user-1');
      expect(result.name).toContain('(Copy)');
    });
  });

  describe('submit', () => {
    it('should create submission with values', async () => {
      mockPrisma.formVersion.findUnique.mockResolvedValue({ id: 'v-1', formId: 'f-1' });
      mockPrisma.formSubmission.create.mockResolvedValue({ id: 'sub-1', formId: 'f-1', formVersionId: 'v-1', status: 'submitted', submittedAt: new Date() });
      mockPrisma.formSubmissionValue.create.mockResolvedValue({});
      const result = await service.submit({ formVersionId: 'v-1', values: { 'field-1': 'Hello' } }, 'comp-1', 'user-1');
      expect(result.id).toBe('sub-1');
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      mockPrisma.form.findUnique.mockResolvedValue(makeForm());
      mockPrisma.form.update.mockResolvedValue({});
      const result = await service.softDelete('f-1', 'comp-1');
      expect(result.success).toBe(true);
    });
  });
});
