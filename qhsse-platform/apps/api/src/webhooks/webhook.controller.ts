import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto, UpdateWebhookDto, WebhookQueryDto } from './dto/webhook.dto';

@ApiTags('Webhook Management') @ApiBearerAuth() @Controller('webhooks')
export class WebhookController {
  constructor(private readonly svc: WebhookService) {}

  @Post() @RequiredPermissions('webhook-management.create') @ApiOperation({ summary: 'Create webhook' })
  async create(@Body() dto: CreateWebhookDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('webhook-management.view') @ApiOperation({ summary: 'List webhooks' })
  async findAll(@Request() req: any, @Query() q: WebhookQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('webhook-management.view') @ApiOperation({ summary: 'Get webhook detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('webhook-management.update') @ApiOperation({ summary: 'Update webhook' })
  async update(@Param('id') id: string, @Body() dto: UpdateWebhookDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('webhook-management.delete') @ApiOperation({ summary: 'Delete webhook' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/test') @RequiredPermissions('webhook-management.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Test webhook (sends real POST)' })
  async test(@Param('id') id: string, @Request() req: any) { return this.svc.test(id, req.user.companyId); }

  @Get(':id/logs') @RequiredPermissions('webhook-management.view') @ApiOperation({ summary: 'Get webhook delivery logs' })
  async getLogs(@Param('id') id: string, @Request() req: any) { return this.svc.getLogs(id, req.user.companyId); }
}
