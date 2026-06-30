import { Controller, Get, Patch, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { LegalService } from './legal.service';
import { UpdateLegalSettingsDto } from './dto/legal-settings.dto';

@ApiTags('Legal Compliance') @ApiBearerAuth() @Controller('legal')
export class LegalController {
  constructor(private readonly svc: LegalService) {}

  @Get('settings') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get legal settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('legal.manage_settings') @ApiOperation({ summary: 'Update legal settings' })
  async updateSettings(@Body() dto: UpdateLegalSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('legal.view') @ApiOperation({ summary: 'Get legal master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }

  @Post('master-data/seed-defaults') @RequiredPermissions('legal.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default legal master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
