import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MfaService } from '../mfa.service';

const mockPrisma = {
  mfaSecret: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), deleteMany: vi.fn() },
  recoveryCode: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
  mfaLog: { create: vi.fn() },
  mfaSetting: { findUnique: vi.fn(), upsert: vi.fn() },
};

describe('MfaService', () => {
  let svc: MfaService;
  beforeEach(() => { vi.clearAllMocks(); svc = new MfaService(mockPrisma as any); });

  it('should get status (disabled)', async () => {
    mockPrisma.mfaSecret.findUnique.mockResolvedValue(null);
    const r = await svc.getStatus('user-1');
    expect(r.enabled).toBe(false);
  });

  it('should setup MFA', async () => {
    mockPrisma.mfaSecret.findUnique.mockResolvedValue(null);
    mockPrisma.mfaSecret.create.mockResolvedValue({});
    mockPrisma.mfaLog.create.mockResolvedValue({});
    mockPrisma.recoveryCode.create.mockResolvedValue({});
    const r = await svc.setup('user-1', 'comp-1', { method: 'totp' });
    expect(r.enabled).toBe(true);
    expect(r.recoveryCodes).toHaveLength(8);
  });

  it('should verify TOTP', async () => {
    mockPrisma.mfaSecret.findUnique.mockResolvedValue({ userId: 'user-1', method: 'totp', secret: 'test', isEnabled: true });
    mockPrisma.mfaLog.create.mockResolvedValue({});
    // Verify will fail with random code but shouldn't throw on wrong secret format
    await expect(svc.verify('user-1', 'comp-1', { code: '123456', method: 'totp' }, '127.0.0.1')).rejects.toThrow('Invalid verification code');
  });
});
