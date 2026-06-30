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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIProviderService } from './ai-provider.service';
import {
  CreateProviderDto,
  UpdateProviderDto,
  RotateProviderKeyDto,
  CreateProviderModelDto,
  UpdateProviderModelDto,
} from './dto/provider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Providers')
@ApiBearerAuth()
@Controller('ai/providers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AIProviderController {
  constructor(private readonly providerService: AIProviderService) {}

  @Post()
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Create AI provider' })
  @ApiResponse({ status: 201, description: 'Provider created successfully' })
  async createProvider(@Request() req, @Body() dto: CreateProviderDto) {
    return this.providerService.createProvider(req.user.companyId, req.user.id, dto);
  }

  @Get()
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List all AI providers' })
  async listProviders(@Request() req) {
    return this.providerService.listProviders(req.user.companyId);
  }

  @Get(':id')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get provider by ID' })
  async getProvider(@Request() req, @Param('id') id: string) {
    return this.providerService.getProvider(id, req.user.companyId);
  }

  @Patch(':id')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Update provider' })
  async updateProvider(@Request() req, @Param('id') id: string, @Body() dto: UpdateProviderDto) {
    return this.providerService.updateProvider(id, req.user.companyId, req.user.id, dto);
  }

  @Delete(':id')
  @RequiredPermissions('ai.manage_provider')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete provider' })
  async deleteProvider(@Request() req, @Param('id') id: string) {
    return this.providerService.deleteProvider(id, req.user.companyId, req.user.id);
  }

  @Post(':id/rotate-key')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Rotate provider API key' })
  async rotateKey(@Request() req, @Param('id') id: string, @Body() dto: RotateProviderKeyDto) {
    return this.providerService.rotateProviderKey(id, req.user.companyId, req.user.id, dto);
  }

  @Post(':id/test')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Test provider connection' })
  async testProvider(@Request() req, @Param('id') id: string) {
    return this.providerService.testProvider(id, req.user.companyId);
  }

  @Post('models')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Create provider model' })
  async createModel(@Request() req, @Body() dto: CreateProviderModelDto) {
    return this.providerService.createProviderModel(req.user.companyId, req.user.id, dto);
  }

  @Get(':providerId/models')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List provider models' })
  async listModels(@Request() req, @Param('providerId') providerId: string) {
    return this.providerService.listProviderModels(providerId, req.user.companyId);
  }

  @Get('models/all')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List all available models' })
  async listAllModels(@Request() req) {
    return this.providerService.listAllModels(req.user.companyId);
  }

  @Patch('models/:id')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Update provider model' })
  async updateModel(@Request() req, @Param('id') id: string, @Body() dto: UpdateProviderModelDto) {
    return this.providerService.updateProviderModel(id, req.user.companyId, dto);
  }

  @Post(':providerId/models/sync')
  @RequiredPermissions('ai.manage_provider')
  @ApiOperation({ summary: 'Sync models from provider API' })
  async syncModels(@Request() req, @Param('providerId') providerId: string) {
    return this.providerService.syncProviderModels(providerId, req.user.companyId);
  }
}
