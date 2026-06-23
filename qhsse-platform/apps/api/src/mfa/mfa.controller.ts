import { Controller, Get, Post, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { MfaService } from './mfa.service';
import { SetupMfaDto, VerifyMfaDto, DisableMfaDto, MfaSettingsDto } from './dto/mfa.dto';

@ApiTags('MFA / Multi-Factor Auth') @ApiBearerAuth() @Controller()
export class MfaController {
  constructor(private readonly svc: MfaService) {}

  @Get('mfa/status') @ApiOperation({ summary: 'Get MFA status for current user' })
  async getStatus(@Request() req: any) { return this.svc.getStatus(req.user.id); }

  @Post('mfa/setup') @ApiOperation({ summary: 'Setup MFA' })
  async setup(@Body() dto: SetupMfaDto, @Request() req: any) { return this.svc.setup(req.user.id, req.user.companyId, dto); }

  @Post('mfa/verify') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify MFA code' })
  async verify(@Body() dto: VerifyMfaDto, @Request() req: any) { return this.svc.verify(req.user.id, req.user.companyId, dto, req.ip); }

  @Post('mfa/disable') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Disable MFA' })
  async disable(@Body() dto: DisableMfaDto, @Request() req: any) { return this.svc.disable(req.user.id, req.user.companyId); }

  @Get('mfa/recovery-codes') @ApiOperation({ summary: 'Get recovery code count' })
  async getRecoveryCodes(@Request() req: any) { return this.svc.getRecoveryCodes(req.user.id); }

  @Post('admin/users/:id/reset-mfa') @RequiredPermissions('mfa-multi-factor-authentication.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Admin reset MFA for user' })
  async adminReset(@Param('id') userId: string, @Request() req: any) { return this.svc.adminReset(userId, req.user.companyId, req.user.id); }

  @Get('mfa/settings') @RequiredPermissions('mfa-multi-factor-authentication.view') @ApiOperation({ summary: 'Get company MFA settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Post('mfa/settings') @RequiredPermissions('mfa-multi-factor-authentication.update') @ApiOperation({ summary: 'Update company MFA settings' })
  async updateSettings(@Body() dto: MfaSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }
}
