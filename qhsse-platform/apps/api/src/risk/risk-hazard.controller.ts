import { Controller, Get, Post, Delete, Patch, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { RiskService } from './risk.service';
import { CreateHazardCategoryDto, CreateHazardDto, CreateConsequenceCategoryDto, CreateConsequenceDto, CreateMappingDto, HazardQueryDto } from './dto/hazard.dto';

@ApiTags('Risk - Hazard Library') @ApiBearerAuth() @Controller('risk')
export class RiskHazardController {
  constructor(private readonly svc: RiskService) {}

  @Get('hazard-categories') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get hazard categories' })
  async getHazardCategories(@Request() req: any) { return this.svc.getHazardCategories(req.user.companyId); }
  @Post('hazard-categories') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create hazard category' })
  async createHazardCategory(@Body() dto: CreateHazardCategoryDto, @Request() req: any) { return this.svc.createHazardCategory(dto, req.user.companyId); }

  @Get('hazards') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get hazards' })
  async getHazards(@Request() req: any, @Query() q: HazardQueryDto) { return this.svc.getHazards(req.user.companyId, q); }
  @Post('hazards') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create hazard' })
  async createHazard(@Body() dto: CreateHazardDto, @Request() req: any) { return this.svc.createHazard(dto, req.user.companyId); }
  @Patch('hazards/:id/toggle') @RequiredPermissions('risk.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Toggle hazard active/inactive' })
  async toggleHazard(@Param('id') id: string, @Body('isActive') isActive: boolean) { return this.svc.toggleHazard(id, isActive); }

  @Get('consequence-categories') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get consequence categories' })
  async getConsequenceCategories(@Request() req: any) { return this.svc.getConsequenceCategories(req.user.companyId); }
  @Post('consequence-categories') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create consequence category' })
  async createConsequenceCategory(@Body() dto: CreateConsequenceCategoryDto, @Request() req: any) { return this.svc.createConsequenceCategory(dto, req.user.companyId); }

  @Get('consequences') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get consequences' })
  async getConsequences(@Request() req: any, @Query() q: HazardQueryDto) { return this.svc.getConsequences(req.user.companyId, q); }
  @Post('consequences') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create consequence' })
  async createConsequence(@Body() dto: CreateConsequenceDto, @Request() req: any) { return this.svc.createConsequence(dto, req.user.companyId); }

  @Get('hazard-mappings') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get hazard-consequence mappings' })
  async getMappings(@Request() req: any) { return this.svc.getMappings(req.user.companyId); }
  @Post('hazard-mappings') @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create/update mapping' })
  async createMapping(@Body() dto: CreateMappingDto, @Request() req: any) { return this.svc.createMapping(dto, req.user.companyId); }
  @Delete('hazard-mappings/:id') @RequiredPermissions('risk.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete mapping' })
  async deleteMapping(@Param('id') id: string) { return this.svc.deleteMapping(id); }
}
