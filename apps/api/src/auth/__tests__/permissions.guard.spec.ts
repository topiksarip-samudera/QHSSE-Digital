import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  userRoleAssignment: {
    findMany: vi.fn(),
  },
};

const mockReflector = {
  getAllAndOverride: vi.fn(),
};

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;

  beforeEach(() => {
    vi.resetAllMocks();
    guard = new PermissionsGuard(mockReflector as any, mockPrisma as any);
  });

  function mockContext(user: any, requiredPerms?: string[]) {
    mockReflector.getAllAndOverride.mockReturnValue(requiredPerms ?? []);
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should allow access when no permissions required', async () => {
    const ctx = mockContext({ sub: 'u1' }, []);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when no user', async () => {
    const ctx = mockContext(null, ['company.view']);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should allow super admin to bypass all permission checks', async () => {
    const ctx = mockContext({ sub: 'u1', isSuperAdmin: true }, ['company.delete']);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    // Should NOT query database
    expect(mockPrisma.userRoleAssignment.findMany).not.toHaveBeenCalled();
  });

  it('should allow access when user has all required permissions', async () => {
    mockPrisma.userRoleAssignment.findMany.mockResolvedValue([
      {
        role: {
          permissions: [
            { permission: { module: 'company', action: 'view' } },
            { permission: { module: 'company', action: 'create' } },
          ],
        },
      },
    ]);

    const ctx = mockContext({ sub: 'u1' }, ['company.view', 'company.create']);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user lacks required permissions', async () => {
    mockPrisma.userRoleAssignment.findMany.mockResolvedValue([
      {
        role: {
          permissions: [
            { permission: { module: 'company', action: 'view' } },
          ],
        },
      },
    ]);

    const ctx = mockContext({ sub: 'u1' }, ['company.view', 'company.delete']);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user has no roles', async () => {
    mockPrisma.userRoleAssignment.findMany.mockResolvedValue([]);

    const ctx = mockContext({ sub: 'u1' }, ['company.view']);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
