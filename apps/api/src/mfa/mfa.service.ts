import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetupMfaDto, VerifyMfaDto, DisableMfaDto, MfaSettingsDto } from './dto/mfa.dto';
import * as crypto from 'crypto';

function generateTotpSecret(): { base32: string; otpauthUrl: string } {
  const secret = crypto.randomBytes(20).toString('hex');
  return { base32: secret, otpauthUrl: `otpauth://totp/QHSSE?secret=${secret}` };
}

function verifyTotp(secret: string, code: string): boolean {
  // Simple TOTP verification using HMAC-SHA1
  const timeSlice = Math.floor(Date.now() / 30000);
  for (let i = -1; i <= 1; i++) {
    const ts = timeSlice + i;
    const msg = Buffer.alloc(8);
    msg.writeBigInt64BE(BigInt(ts));
    const hmac = crypto.createHmac('sha1', secret).update(msg).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binCode = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
    const otp = String(binCode % 1000000).padStart(6, '0');
    if (otp === code) return true;
  }
  return false;
}

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: string) {
    const secret = await this.prisma.mfaSecret.findUnique({ where: { userId } });
    return { enabled: !!secret && secret.isEnabled, method: secret?.method || null };
  }

  async setup(userId: string, companyId: string, dto: SetupMfaDto) {
    const existing = await this.prisma.mfaSecret.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException('MFA already configured');

    let secret: string;
    if (dto.method !== 'totp') throw new BadRequestException('Only TOTP method supported');

    const { base32, otpauthUrl } = generateTotpSecret();
    secret = base32;
    const otpauth_url = otpauthUrl;

    await this.prisma.mfaSecret.create({ data: { userId, method: dto.method, secret } });
    await this.prisma.mfaLog.create({ data: { userId, companyId, action: 'setup', method: dto.method, success: true } });

    // Generate recovery codes
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(6).toString('hex');
      await this.prisma.recoveryCode.create({ data: { userId, codeHash: crypto.createHash('sha256').update(code).digest('hex') } });
      codes.push(code);
    }

    return { enabled: true, method: dto.method, secret, otpauthUrl: otpauth_url, recoveryCodes: codes };
  }

  async verify(userId: string, companyId: string, dto: VerifyMfaDto, ip: string) {
    const mfa = await this.prisma.mfaSecret.findUnique({ where: { userId } });
    if (!mfa || !mfa.isEnabled) throw new BadRequestException('MFA not configured');

    if (dto.method === 'totp') {
      const verified = verifyTotp(mfa.secret, dto.code);
      if (!verified) {
        await this.prisma.mfaLog.create({ data: { userId, companyId, action: 'verify', method: dto.method, success: false, ipAddress: ip, error: 'Invalid TOTP code' } });
        throw new BadRequestException('Invalid verification code');
      }
      await this.prisma.mfaLog.create({ data: { userId, companyId, action: 'verify', method: dto.method, success: true, ipAddress: ip } });
      return { verified: true };
    }

    throw new BadRequestException(`Unsupported method: ${dto.method}`);
  }

  async disable(userId: string, companyId: string) {
    const mfa = await this.prisma.mfaSecret.findUnique({ where: { userId } });
    if (!mfa) throw new NotFoundException('MFA not configured');

    await this.prisma.mfaSecret.update({ where: { userId }, data: { isEnabled: false } });
    await this.prisma.recoveryCode.deleteMany({ where: { userId } });
    await this.prisma.mfaLog.create({ data: { userId, companyId, action: 'disable', method: mfa.method, success: true } });
    return { disabled: true };
  }

  async getRecoveryCodes(userId: string) {
    const codes = await this.prisma.recoveryCode.findMany({ where: { userId, isUsed: false } });
    return { count: codes.length };
  }

  async adminReset(userId: string, companyId: string, adminId: string) {
    await this.prisma.mfaSecret.deleteMany({ where: { userId } });
    await this.prisma.recoveryCode.deleteMany({ where: { userId } });
    await this.prisma.mfaLog.create({ data: { userId, companyId, action: 'reset', success: true } });
    return { reset: true, userId };
  }

  async getSettings(companyId: string) {
    const s = await this.prisma.mfaSetting.findUnique({ where: { companyId } });
    return s || { requireMfa: false, allowedMethods: ['totp'] };
  }

  async updateSettings(companyId: string, dto: MfaSettingsDto) {
    return this.prisma.mfaSetting.upsert({
      where: { companyId },
      create: { companyId, requireMfa: dto.requireMfa ?? false, allowedMethods: dto.allowedMethods ?? ['totp'] },
      update: { requireMfa: dto.requireMfa ?? false, allowedMethods: dto.allowedMethods },
    });
  }
}
