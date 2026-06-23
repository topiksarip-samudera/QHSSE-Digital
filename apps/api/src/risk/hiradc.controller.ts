import { Controller, Get, Post, Patch, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { HiradcService } from './hiradc.service';
import { CreateHiradcDto, AddHazardDto } from './dto/hiradc.dto';

@ApiTags('Risk - HIRADC Builder') @ApiBearerAuth() @Controller('hiradc')
export class HiradcController {
  constructor(private readonly svc: HiradcService) {}

  @Post() @RequiredPermissions('risk.create') @ApiOperation({ summary: 'Create HIRADC record' })
  async create(@Body() dto: CreateHiradcDto, @Request() req: any) { return this.svc.create(dto, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('risk.view') @ApiOperation({ summary: 'List HIRADC records' })
  async findAll(@Request() req: any) { return this.svc.findAll(req.user.companyId); }

  @Get(':id') @RequiredPermissions('risk.view') @ApiOperation({ summary: 'Get HIRADC detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('risk.delete') @ApiOperation({ summary: 'Delete HIRADC' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/submit') @RequiredPermissions('risk.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit HIRADC' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId); }

  @Post(':id/activities') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add activity' })
  async addActivity(@Param('id') id: string, @Body('name') name: string, @Request() req: any) { return this.svc.addActivity(id, name, req.user.companyId); }

  @Post('hazards') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Add hazard to activity' })
  async addHazard(@Body() dto: AddHazardDto, @Request() req: any) { return this.svc.addHazard(dto, req.user.companyId); }

  @Patch('hazards/:hazardId') @RequiredPermissions('risk.update') @ApiOperation({ summary: 'Update hazard' })
  async updateHazard(@Param('hazardId') hazardId: string, @Body() data: any, @Request() req: any) { return this.svc.updateHazard(hazardId, data, req.user.companyId); }
}
