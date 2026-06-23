import { Controller, Get, Post, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto, ApiKeyQueryDto } from './dto/api-key.dto';

@ApiTags('API Key Management') @ApiBearerAuth() @Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly svc: ApiKeyService) {}

  @Post() @RequiredPermissions('api-key-management.create') @ApiOperation({ summary: 'Create API key' })
  async create(@Body() dto: CreateApiKeyDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('api-key-management.view') @ApiOperation({ summary: 'List API keys' })
  async findAll(@Request() req: any, @Query() q: ApiKeyQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('api-key-management.view') @ApiOperation({ summary: 'Get API key detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Post(':id/revoke') @RequiredPermissions('api-key-management.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Revoke API key' })
  async revoke(@Param('id') id: string, @Request() req: any) { return this.svc.revoke(id, req.user.companyId); }

  @Post(':id/rotate') @RequiredPermissions('api-key-management.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Rotate API key (revoke old, create new)' })
  async rotate(@Param('id') id: string, @Request() req: any) { return this.svc.rotate(id, req.user.companyId); }

  @Get(':id/usage') @RequiredPermissions('api-key-management.view') @ApiOperation({ summary: 'Get API key usage logs' })
  async getUsage(@Param('id') id: string, @Request() req: any) { return this.svc.getUsage(id, req.user.companyId); }
}
