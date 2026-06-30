import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { EnvironmentAspectService } from './aspect.service';

@ApiTags('Environment - Aspects & Impacts') @ApiBearerAuth() @Controller('environment')
export class EnvironmentAspectController {
  constructor(private readonly svc: EnvironmentAspectService) {}

  // Aspects
  @Post('aspects') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create aspect' })
  async createAspect(@Body() d: any, @Request() req: any) { return this.svc.createAspect(d, req.user.companyId, req.user.id); }
  @Get('aspects') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List aspects' })
  async getAspects(@Request() req: any, @Query() q: any) { return this.svc.getAspects(req.user.companyId, q); }
  @Get('aspects/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get aspect' })
  async findOneAspect(@Param('id') id: string, @Request() req: any) { return this.svc.findOneAspect(id, req.user.companyId); }
  @Patch('aspects/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update aspect' })
  async updateAspect(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateAspect(id, d, req.user.companyId); }
  @Delete('aspects/:id') @RequiredPermissions('env.delete') @ApiOperation({ summary: 'Delete aspect' })
  async deleteAspect(@Param('id') id: string, @Request() req: any) { return this.svc.softDeleteAspect(id, req.user.companyId); }

  // Impacts
  @Post('impacts') @RequiredPermissions('env.create') @ApiOperation({ summary: 'Create impact' })
  async createImpact(@Body() d: any, @Request() req: any) { return this.svc.createImpact(d, req.user.companyId, req.user.id); }
  @Get('impacts') @RequiredPermissions('env.view') @ApiOperation({ summary: 'List impacts' })
  async getImpacts(@Request() req: any, @Query() q: any) { return this.svc.getImpacts(req.user.companyId, q); }
  @Get('impacts/:id') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Get impact' })
  async findOneImpact(@Param('id') id: string, @Request() req: any) { return this.svc.findOneImpact(id, req.user.companyId); }
  @Patch('impacts/:id') @RequiredPermissions('env.update') @ApiOperation({ summary: 'Update impact' })
  async updateImpact(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.updateImpact(id, d, req.user.companyId); }
  @Delete('impacts/:id') @RequiredPermissions('env.delete') @ApiOperation({ summary: 'Delete impact' })
  async deleteImpact(@Param('id') id: string, @Request() req: any) { return this.svc.softDeleteImpact(id, req.user.companyId); }

  // Significance
  @Get('aspects/:id/significance') @RequiredPermissions('env.view') @ApiOperation({ summary: 'Calculate significance' })
  async calculateSignificance(@Param('id') id: string) { return this.svc.calculateSignificance(id); }
}
