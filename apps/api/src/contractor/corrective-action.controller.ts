import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ContractorCorrectiveActionService } from './corrective-action.service';

@ApiTags('Contractor Management') @ApiBearerAuth() @Controller('contractor/corrective-actions')
export class ContractorCorrectiveActionController {
  constructor(private readonly svc: ContractorCorrectiveActionService) {}

  @Get() @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'List corrective actions' })
  async findAll(@Request() req: any, @Query() query?: any) { return this.svc.findAll(req.user.companyId, query); }

  @Get(':id') @RequiredPermissions('contractor.view') @ApiOperation({ summary: 'Get corrective action' })
  async findOne(@Request() req: any, @Param('id') id: string) { return this.svc.findOne(id, req.user.companyId); }

  @Post() @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Create corrective action' })
  async create(@Request() req: any, @Body() dto: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Patch(':id') @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Update corrective action' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto, req.user.companyId); }

  @Post(':id/complete') @HttpCode(200) @RequiredPermissions('contractor.edit') @ApiOperation({ summary: 'Mark corrective action as completed' })
  async complete(@Request() req: any, @Param('id') id: string) { return this.svc.complete(id, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('contractor.delete') @ApiOperation({ summary: 'Delete corrective action' })
  async delete(@Request() req: any, @Param('id') id: string) { return this.svc.delete(id, req.user.companyId); }
}
