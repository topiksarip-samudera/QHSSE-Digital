import { Controller, Get, Post, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { JsaService } from './jsa.service';

@ApiTags('Risk - JSA Builder') @ApiBearerAuth() @Controller('jsa')
export class JsaController {
  constructor(private readonly svc: JsaService) {}

  @Post() @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create JSA' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('risk.view') @ApiOperation({ summary: 'List JSA records' })
  async findAll(@Request() req: any) { return this.svc.findAll(req.user.companyId); }

  @Get(':id') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get JSA detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('risk.delete') @ApiOperation({ summary: 'Delete JSA' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/submit') @RequiredPermissions('risk.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit JSA' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId); }

  @Post(':id/steps') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add JSA step' })
  async addStep(@Param('id') id: string, @Body('description') desc: string, @Request() req: any) { return this.svc.addStep(id, desc, req.user.companyId, req.user.id); }

  @Post('steps/:stepId/hazards') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add hazard to step' })
  async addHazard(@Param('stepId') stepId: string, @Body() d: any, @Request() req: any) { return this.svc.addHazard(stepId, d, req.user.companyId); }

  @Post('steps/:stepId/controls') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add control to step' })
  async addControl(@Param('stepId') stepId: string, @Body() d: any, @Request() req: any) { return this.svc.addControl(stepId, d, req.user.companyId); }
}
