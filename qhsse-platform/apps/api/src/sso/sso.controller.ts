import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SsoService } from './sso.service';
import { CreateSsoProviderDto, UpdateSsoProviderDto, SsoQueryDto } from './dto/sso.dto';

@ApiTags('SSO / Single Sign-On') @ApiBearerAuth() @Controller()
export class SsoController {
  constructor(private readonly svc: SsoService) {}

  @Post('sso-providers') @RequiredPermissions('sso-single-sign-on.create') @ApiOperation({ summary: 'Create SSO provider' })
  async create(@Body() dto: CreateSsoProviderDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get('sso-providers') @RequiredPermissions('sso-single-sign-on.view') @ApiOperation({ summary: 'List SSO providers' })
  async findAll(@Request() req: any, @Query() q: SsoQueryDto) { return this.svc.findAll(req.user.companyId, q); }

  @Get('sso-providers/:id') @RequiredPermissions('sso-single-sign-on.view') @ApiOperation({ summary: 'Get SSO provider' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch('sso-providers/:id') @RequiredPermissions('sso-single-sign-on.update') @ApiOperation({ summary: 'Update SSO provider' })
  async update(@Param('id') id: string, @Body() dto: UpdateSsoProviderDto, @Request() req: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Delete('sso-providers/:id') @RequiredPermissions('sso-single-sign-on.delete') @ApiOperation({ summary: 'Delete SSO provider' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post('sso-providers/:id/test') @RequiredPermissions('sso-single-sign-on.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Test SSO provider configuration' })
  async test(@Param('id') id: string, @Request() req: any) { return this.svc.testProvider(id, req.user.companyId); }

  @Get('sso-login-logs') @RequiredPermissions('sso-single-sign-on.view') @ApiOperation({ summary: 'Get SSO login history' })
  async getLogs(@Request() req: any) { return this.svc.getLoginLogs(req.user.companyId); }
}
