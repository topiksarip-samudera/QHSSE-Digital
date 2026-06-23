import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth.service';
import {
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

// ─── Mock bcrypt ───────────────────────────────────────────────────────────
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed-value'),
  compare: vi.fn(),
}));

// ─── Mock crypto — not needed, real crypto works in tests ────────────────────
// crypto is a Node built-in and works fine in test environment

// ─── Mock PrismaService ────────────────────────────────────────────────────
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  refreshToken: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  passwordResetToken: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  loginHistory: {
    create: vi.fn(),
  },
  userProfile: {
    create: vi.fn(),
  },
};

// ─── Mock JwtService ───────────────────────────────────────────────────────
const mockJwtService = {
  signAsync: vi.fn().mockResolvedValue('mock-jwt-token'),
  verify: vi.fn(),
};

// ─── Mock ConfigService ────────────────────────────────────────────────────
const mockConfigService = {
  get: vi.fn((key: string, defaultVal?: string) => {
    const config: Record<string, string> = {
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      NODE_ENV: 'test',
    };
    return config[key] ?? defaultVal;
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let bcrypt: any;

  beforeEach(async () => {
    vi.resetAllMocks();
    bcrypt = await import('bcryptjs');
    service = new AuthService(
      mockPrisma as any,
      mockJwtService as any,
      mockConfigService as any,
    );
  });

  // ─── LOGIN ────────────────────────────────────────────────────────────
  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'Password1!' };
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'hashed',
      status: 'active',
      isSuperAdmin: false,
      loginAttempts: 0,
      lockedUntil: null,
      companyAssignments: [
        { company: { id: 'c1', name: 'Company', code: 'CO', status: 'active' }, isPrimary: true },
      ],
      roles: [],
    };

    it('should login successfully and return tokens + user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.loginHistory.create.mockResolvedValue({});
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto, '127.0.0.1', 'TestAgent');

      expect(result.user.id).toBe('user-1');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockPrisma.loginHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'success', userId: 'user-1' }),
        }),
      );
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when account is locked', async () => {
      const lockedUser = {
        ...mockUser,
        lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
      };
      mockPrisma.user.findUnique.mockResolvedValue(lockedUser);
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when account is not active', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, status: 'suspended' });
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when no active company', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        companyAssignments: [
          { company: { id: 'c1', name: 'Co', code: 'C', status: 'suspended' }, isPrimary: true },
        ],
      });
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw UnauthorizedException for wrong password and increment attempts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ loginAttempts: 1 }),
        }),
      );
    });

    it('should lock account after max failed attempts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, loginAttempts: 4 });
      (bcrypt.compare as any).mockResolvedValue(false);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.loginHistory.create.mockResolvedValue({});

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ loginAttempts: 5, lockedUntil: expect.any(Date) }),
        }),
      );
    });

    it('should allow super admin without active company', async () => {
      const superAdmin = {
        ...mockUser,
        isSuperAdmin: true,
        companyAssignments: [],
      };
      mockPrisma.user.findUnique.mockResolvedValue(superAdmin);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.loginHistory.create.mockResolvedValue({});

      const result = await service.login(loginDto);
      expect(result.user.isSuperAdmin).toBe(true);
    });
  });

  // ─── REGISTER ─────────────────────────────────────────────────────────
  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      password: 'StrongP@ss1',
      firstName: 'New',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'new-user-1',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });

      const result = await service.register(registerDto);
      expect(result.id).toBe('new-user-1');
      expect(result.email).toBe(registerDto.email);
    });

    it('should throw ConflictException for existing email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should reject weak passwords (no uppercase)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.register({ ...registerDto, password: 'weakpassword1!' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject weak passwords (no number)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.register({ ...registerDto, password: 'WeakPassword!' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject weak passwords (too short)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.register({ ...registerDto, password: 'Wk1!' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────
  describe('changePassword', () => {
    const mockUser = { id: 'u1', passwordHash: 'hashed' };

    it('should change password successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      const result = await service.changePassword('u1', 'OldP@ss1!', 'NewP@ss1!');
      expect(result.message).toContain('changed');
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword('u1', 'OldP@ss1!', 'NewP@ss1!')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException for wrong current password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(service.changePassword('u1', 'WrongOld!', 'NewP@ss1!')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject same password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);

      await expect(service.changePassword('u1', 'SameP@ss1', 'SameP@ss1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject weak new password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);

      await expect(service.changePassword('u1', 'OldP@ss1!', 'weak')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── FORGOT PASSWORD ──────────────────────────────────────────────────
  describe('forgotPassword', () => {
    it('should create reset token for existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', status: 'active' });
      mockPrisma.passwordResetToken.updateMany.mockResolvedValue({});
      mockPrisma.passwordResetToken.create.mockResolvedValue({});

      const result = await service.forgotPassword('user@example.com');
      expect(result.message).toContain('sent');
      expect(result.resetToken).toBeDefined();
      expect(typeof result.resetToken).toBe('string');
      expect((result.resetToken as string).length).toBeGreaterThan(0);
    });

    it('should return success message for non-existent user (prevent enumeration)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('nobody@example.com');
      expect(result.message).toContain('sent');
      expect(result.resetToken).toBeUndefined();
    });
  });

  // ─── RESET PASSWORD ───────────────────────────────────────────────────
  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockPrisma.passwordResetToken.findMany.mockResolvedValue([
        { id: 'rt1', userId: 'u1', tokenHash: 'hashed-token', expiresAt: new Date(Date.now() + 3600000) },
      ]);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.passwordResetToken.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      const result = await service.resetPassword('raw-token', 'NewP@ss1!');
      expect(result.message).toContain('reset');
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockPrisma.passwordResetToken.findMany.mockResolvedValue([]);

      await expect(service.resetPassword('bad-token', 'NewP@ss1!')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject weak password on reset', async () => {
      await expect(service.resetPassword('token', 'weak')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── SESSIONS ─────────────────────────────────────────────────────────
  describe('getSessions', () => {
    it('should return active sessions', async () => {
      mockPrisma.refreshToken.findMany.mockResolvedValue([
        { id: 's1', ipAddress: '127.0.0.1', userAgent: 'Chrome', createdAt: new Date(), expiresAt: new Date() },
      ]);

      const result = await service.getSessions('u1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('s1');
    });
  });

  describe('revokeSession', () => {
    it('should revoke a specific session', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue({ id: 's1', userId: 'u1' });
      mockPrisma.refreshToken.update.mockResolvedValue({});

      const result = await service.revokeSession('u1', 's1');
      expect(result.message).toContain('revoked');
    });

    it('should throw NotFoundException for non-existent session', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue(null);

      await expect(service.revokeSession('u1', 'bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('revokeAllSessions', () => {
    it('should revoke all sessions', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.revokeAllSessions('u1');
      expect(result.message).toContain('3');
    });
  });

  // ─── LOGOUT ───────────────────────────────────────────────────────────
  describe('logout', () => {
    it('should revoke all tokens when no refresh token provided', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.logout('u1');
      expect(result.message).toContain('Logged out');
    });

    it('should revoke specific token when provided', async () => {
      mockPrisma.refreshToken.findMany.mockResolvedValue([
        { id: 'rt1', tokenHash: 'hashed' },
      ]);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrisma.refreshToken.update.mockResolvedValue({});

      const result = await service.logout('u1', 'refresh-token');
      expect(result.message).toContain('Logged out');
    });
  });

  // ─── REFRESH TOKENS ───────────────────────────────────────────────────
  describe('refreshTokens', () => {
    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

      await expect(service.refreshTokens('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
