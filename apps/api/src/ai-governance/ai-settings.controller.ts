import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AISettingsService } from './ai-settings.service';
import {
  UpdateAISettingsDto,
  CreateFeatureToggleDto,
  UpdateFeatureToggleDto,
  CreateGuardrailPolicyDto,
  UpdateGuardrailPolicyDto,
  CreateRateLimitDto,
  UpdateRateLimitDto,
  UpdateAdminControlDto,
} from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Settings')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AISettingsController {
  constructor(private readonly settingsService: AISettingsService) {}

  @Get('settings')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get AI settings' })
  async getSettings(@Request() req) {
    return this.settingsService.getSettings(req.user.companyId);
  }

  @Patch('settings')
  @RequiredPermissions('ai.manage_settings')
  @ApiOperation({ summary: 'Update AI settings' })
  async updateSettings(@Request() req, @Body() dto: UpdateAISettingsDto) {
    return this.settingsService.updateSettings(req.user.companyId, dto);
  }

  @Post('feature-toggles')
  @RequiredPermissions('ai.manage_settings')
  @ApiOperation({ summary: 'Create feature toggle' })
  async createFeatureToggle(@Request() req, @Body() dto: CreateFeatureToggleDto) {
    return this.settingsService.createFeatureToggle(req.user.companyId, dto);
  }

  @Get('feature-toggles')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List feature toggles' })
  async listFeatureToggles(@Request() req) {
    return this.settingsService.listFeatureToggles(req.user.companyId);
  }

  @Patch('feature-toggles/:key')
  @RequiredPermissions('ai.manage_settings')
  @ApiOperation({ summary: 'Update feature toggle' })
  async updateFeatureToggle(
    @Request() req,
    @Param('key') key: string,
    @Body() dto: UpdateFeatureToggleDto,
  ) {
    return this.settingsService.updateFeatureToggle(req.user.companyId, key, dto);
  }

  @Post('guardrail-policies')
  @RequiredPermissions('ai.manage_guardrail')
  @ApiOperation({ summary: 'Create guardrail policy' })
  async createGuardrailPolicy(@Request() req, @Body() dto: CreateGuardrailPolicyDto) {
    return this.settingsService.createGuardrailPolicy(req.user.companyId, req.user.id, dto);
  }

  @Get('guardrail-policies')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List guardrail policies' })
  async listGuardrailPolicies(@Request() req) {
    return this.settingsService.listGuardrailPolicies(req.user.companyId);
  }

  @Patch('guardrail-policies/:key')
  @RequiredPermissions('ai.manage_guardrail')
  @ApiOperation({ summary: 'Update guardrail policy' })
  async updateGuardrailPolicy(
    @Request() req,
    @Param('key') key: string,
    @Body() dto: UpdateGuardrailPolicyDto,
  ) {
    return this.settingsService.updateGuardrailPolicy(req.user.companyId, key, dto);
  }

  @Post('rate-limits')
  @RequiredPermissions('ai.manage_usage_limit')
  @ApiOperation({ summary: 'Create rate limit' })
  async createRateLimit(@Request() req, @Body() dto: CreateRateLimitDto) {
    return this.settingsService.createRateLimit(req.user.companyId, dto);
  }

  @Get('rate-limits')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'List rate limits' })
  async listRateLimits(@Request() req) {
    return this.settingsService.listRateLimits(req.user.companyId);
  }

  @Patch('rate-limits/:id')
  @RequiredPermissions('ai.manage_usage_limit')
  @ApiOperation({ summary: 'Update rate limit' })
  async updateRateLimit(@Request() req, @Param('id') id: string, @Body() dto: UpdateRateLimitDto) {
    return this.settingsService.updateRateLimit(id, req.user.companyId, dto);
  }

  @Delete('rate-limits/:id')
  @RequiredPermissions('ai.manage_usage_limit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete rate limit' })
  async deleteRateLimit(@Request() req, @Param('id') id: string) {
    return this.settingsService.deleteRateLimit(id, req.user.companyId);
  }

  @Get('admin-controls')
  @RequiredPermissions('ai.manage_settings')
  @ApiOperation({ summary: 'Get admin controls' })
  async getAdminControls(@Request() req) {
    return this.settingsService.getAdminControls(req.user.companyId);
  }

  @Patch('admin-controls')
  @RequiredPermissions('ai.manage_settings')
  @ApiOperation({ summary: 'Update admin controls' })
  async updateAdminControls(@Request() req, @Body() dto: UpdateAdminControlDto) {
    return this.settingsService.updateAdminControls(req.user.companyId, req.user.id, dto);
  }
}
