import { Controller, Get, Post, Patch, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { TrainingService } from './training.service';
import { UpdateTrainingSettingsDto } from './dto/training-settings.dto';

@ApiTags('Training & Competency') @ApiBearerAuth() @Controller('training')
export class TrainingController {
  constructor(private readonly svc: TrainingService) {}

  @Get('settings') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training settings' })
  async getSettings(@Request() req: any) { return this.svc.getSettings(req.user.companyId); }
  @Patch('settings') @RequiredPermissions('training.manage_settings') @ApiOperation({ summary: 'Update settings' })
  async updateSettings(@Body() dto: UpdateTrainingSettingsDto, @Request() req: any) { return this.svc.updateSettings(req.user.companyId, dto); }

  @Get('master-data') @RequiredPermissions('training.view') @ApiOperation({ summary: 'Get training master data' })
  async getMasterData(@Request() req: any) { return this.svc.getMasterData(req.user.companyId); }
  @Post('master-data/seed-defaults') @RequiredPermissions('training.manage_settings') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Seed default master data' })
  async seedDefaults(@Request() req: any) { return this.svc.seedDefaults(req.user.companyId); }
}
