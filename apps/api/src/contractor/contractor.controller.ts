import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ContractorService } from './contractor.service';
import { UpdateContractorSettingsDto } from './dto/contractor-settings.dto';

@ApiTags('Contractor Management') @ApiBearerAuth() @Controller('contractor')
export class ContractorController {
  constructor(private readonly svc: ContractorService) {}

  @Get('settings') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get contractor settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }

  @Patch('settings') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Update contractor settings' })
  async updateSettings(@Body() dto: UpdateContractorSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('score') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get contractor score' })
  async getScore(@Request() req: any) { return this.svc.getScore(req.user.companyId); }

  @Post('score/recalculate') @RequiredPermissions('contractor.update') @ApiOperation({ summary: 'Recalculate contractor score' })
  async recalculateScore(@Request() req: any) { return this.svc.recalculateScore(req.user.companyId); }
}
