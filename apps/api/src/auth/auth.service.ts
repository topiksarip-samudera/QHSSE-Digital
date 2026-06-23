import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// ─── Password Policy ───────────────────────────────────────────────────────
const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

function validatePasswordPolicy(password: string): string | null {
  if (password.length < PASSWORD_POLICY.minLength) return `Password must be at least ${PASSWORD_POLICY.minLength} characters`;
  if (password.length > PASSWORD_POLICY.maxLength) return `Password must be at most ${PASSWORD_POLICY.maxLength} characters`;
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (PASSWORD_POLICY.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Login ──────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        profile: true,
        companyAssignments: {
          where: { status: 'active' },
          include: { company: true },
        },
        roles: {
          include: { role: true },
        },
      },
    });

    // User not found — log failed attempt with generic message
    if (!user) {
      await this.logLoginHistory(null, dto.email, 'failed', ip, userAgent, 'Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Account locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      await this.logLoginHistory(user.id, dto.email, 'blocked', ip, userAgent, 'Account locked');
      throw new ForbiddenException(`Account is locked. Try again in ${minutesLeft} minutes.`);
    }

    // Account not active
    if (user.status !== 'active') {
      await this.logLoginHistory(user.id, dto.email, 'blocked', ip, userAgent, `Account status: ${user.status}`);
      throw new ForbiddenException('Account is not active');
    }

    // Check active company
    const activeCompanies = user.companyAssignments.filter(
      (ca) => ca.company.status === 'active',
    );
    if (!user.isSuperAdmin && activeCompanies.length === 0) {
      await this.logLoginHistory(user.id, dto.email, 'blocked', ip, userAgent, 'No active company');
      throw new ForbiddenException('No active company associated with this account. Contact your administrator.');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed attempts
      const newAttempts = user.loginAttempts + 1;
      const updateData: any = { loginAttempts: newAttempts };

      // Lock account if max attempts reached
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
        updateData.lockedUntil = lockedUntil;
      }

      await this.prisma.user.update({ where: { id: user.id }, data: updateData });
      await this.logLoginHistory(user.id, dto.email, 'failed', ip, userAgent, 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Success — reset login attempts and generate tokens
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.isSuperAdmin);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt,
        ipAddress: ip,
        userAgent,
      },
    });

    // Log successful login
    await this.logLoginHistory(user.id, dto.email, 'success', ip, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperAdmin: user.isSuperAdmin,
        companies: user.companyAssignments.map((ca) => ({
          id: ca.company.id,
          name: ca.company.name,
          code: ca.company.code,
          isPrimary: ca.isPrimary,
        })),
      },
      ...tokens,
    };
  }

  // ─── Register ───────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Validate password policy
    const policyError = validatePasswordPolicy(dto.password);
    if (policyError) {
      throw new BadRequestException(policyError);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        passwordChangedAt: new Date(),
        profile: {
          create: {
            timezone: 'Asia/Jakarta',
            language: 'id',
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // ─── Refresh Tokens ─────────────────────────────────────────────────────
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find and validate stored refresh token
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: { userId: user.id, revokedAt: null },
      });

      let validToken = null;
      for (const stored of storedTokens) {
        const match = await bcrypt.compare(refreshToken, stored.tokenHash);
        if (match && stored.expiresAt > new Date()) {
          validToken = stored;
          break;
        }
      }

      if (!validToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke old token
      await this.prisma.refreshToken.update({
        where: { id: validToken.id },
        data: { revokedAt: new Date() },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.isSuperAdmin);

      await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: await bcrypt.hash(tokens.refreshToken, 10),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: validToken.ipAddress,
          userAgent: validToken.userAgent,
        },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ─── Logout ─────────────────────────────────────────────────────────────
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: { userId, revokedAt: null },
      });

      for (const stored of storedTokens) {
        const match = await bcrypt.compare(refreshToken, stored.tokenHash);
        if (match) {
          await this.prisma.refreshToken.update({
            where: { id: stored.id },
            data: { revokedAt: new Date() },
          });
          break;
        }
      }
    } else {
      // Revoke all tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return { message: 'Logged out successfully' };
  }

  // ─── Get Profile ────────────────────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        companyAssignments: {
          where: { status: 'active' },
          include: { company: true },
        },
        siteAssignments: {
          where: { status: 'active' },
          include: { site: true },
        },
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        scopes: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  // ─── Change Password ────────────────────────────────────────────────────
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Current password is incorrect');

    const policyError = validatePasswordPolicy(newPassword);
    if (policyError) throw new BadRequestException(policyError);

    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordChangedAt: new Date(), loginAttempts: 0, lockedUntil: null },
    });

    // Revoke all refresh tokens (force re-login)
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // ─── Forgot Password ────────────────────────────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || user.status !== 'active') {
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Invalidate previous tokens
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Generate reset token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // In production, send email with rawToken. For now, return it for testing.
    return {
      message: 'If the email exists, a password reset link has been sent.',
      // Only include token in non-production
      ...(this.configService.get('NODE_ENV') !== 'production' && { resetToken: rawToken }),
    };
  }

  // ─── Reset Password ─────────────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    const policyError = validatePasswordPolicy(newPassword);
    if (policyError) throw new BadRequestException(policyError);

    // Find all non-expired, unused tokens
    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    let validToken = null;
    for (const stored of resetTokens) {
      const match = await bcrypt.compare(token, stored.tokenHash);
      if (match) {
        validToken = stored;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and mark token as used
    await this.prisma.user.update({
      where: { id: validToken.userId },
      data: { passwordHash, passwordChangedAt: new Date(), loginAttempts: 0, lockedUntil: null },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: validToken.id },
      data: { usedAt: new Date() },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId: validToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ─── Get Active Sessions ────────────────────────────────────────────────
  async getSessions(userId: string) {
    const sessions = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions;
  }

  // ─── Revoke Session (Force Logout) ──────────────────────────────────────
  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.refreshToken.findFirst({
      where: { id: sessionId, userId, revokedAt: null },
    });

    if (!session) throw new NotFoundException('Session not found');

    await this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    return { message: 'Session revoked successfully' };
  }

  // ─── Revoke All Sessions (Force Logout All) ─────────────────────────────
  async revokeAllSessions(userId: string) {
    const result = await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: `${result.count} session(s) revoked` };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────
  private async generateTokens(userId: string, email: string, isSuperAdmin: boolean) {
    const payload = { sub: userId, email, isSuperAdmin };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async logLoginHistory(
    userId: string | null,
    email: string,
    status: string,
    ip?: string,
    userAgent?: string,
    failureReason?: string,
  ) {
    try {
      await this.prisma.loginHistory.create({
        data: {
          userId: userId || 'anonymous',
          email,
          status,
          ipAddress: ip,
          userAgent,
          failureReason,
        },
      });
    } catch {
      // Don't fail login if history logging fails
    }
  }
}
