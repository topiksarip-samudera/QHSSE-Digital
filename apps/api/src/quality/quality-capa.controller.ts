import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityCapaService } from './quality-capa.service';
import { QualityLinkService } from './quality-link.service';
import { CreateCapaDto, UpdateCapaDto, CreateCalibrationDto, UpdateCalibrationDto, CreateLinkDto } from './dto/capa.dto';

@ApiTags('Quality - CAPA') @ApiBearerAuth() @Controller('quality')
export class QualityCapaController {
  constructor(private readonly svc: QualityCapaService) {}

  @Post('capa') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create CAPA' })
  async create(@Body() dto: CreateCapaDto, @Request() req: any) { return this.svc.createCapa(dto, req.user.companyId, req.user.id); }

  @Get('capa') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List CAPAs' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllCapa(req.user.companyId, query); }

  @Get('capa/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get CAPA detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findCapa(id, req.user.companyId); }

  @Patch('capa/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update CAPA' })
  async update(@Param('id') id: string, @Body() dto: UpdateCapaDto, @Request() req: any) { return this.svc.updateCapa(id, dto, req.user.companyId); }

  @Delete('capa/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete CAPA' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteCapa(id, req.user.companyId); }

  @Post('capa/:id/verify') @RequiredPermissions('quality.verify') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify CAPA' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verifyCapa(id, req.user.companyId, req.user.id); }

  @Post('capa/:id/reject') @RequiredPermissions('quality.verify') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject CAPA verification' })
  async reject(@Param('id') id: string, @Request() req: any) { return this.svc.rejectVerification(id, req.user.companyId); }
}

@ApiTags('Quality - Calibration') @ApiBearerAuth() @Controller('quality')
export class QualityCalibrationController {
  constructor(private readonly svc: QualityCapaService) {}

  @Post('calibration') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create calibration equipment' })
  async create(@Body() dto: CreateCalibrationDto, @Request() req: any) { return this.svc.createCalibration(dto, req.user.companyId, req.user.id); }

  @Get('calibration') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List calibration equipment' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllCalibration(req.user.companyId, query); }

  @Get('calibration/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get calibration equipment detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findCalibration(id, req.user.companyId); }

  @Patch('calibration/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update calibration equipment' })
  async update(@Param('id') id: string, @Body() dto: UpdateCalibrationDto, @Request() req: any) { return this.svc.updateCalibration(id, dto, req.user.companyId); }

  @Delete('calibration/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete calibration equipment' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteCalibration(id, req.user.companyId); }
}

@ApiTags('Quality - Links') @ApiBearerAuth() @Controller('quality')
export class QualityLinkController {
  constructor(private readonly svc: QualityLinkService) {}

  @Post('links') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create cross-module link' })
  async create(@Body() dto: CreateLinkDto, @Request() req: any) { return this.svc.createLink(dto, req.user.companyId); }

  @Get('links') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List links' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findLinks(req.user.companyId, query); }

  @Delete('links/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete link' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteLink(id, req.user.companyId); }

  @Get('links/cross-module/:qualityRecordId') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get cross-module view' })
  async crossModule(@Param('qualityRecordId') qualityRecordId: string, @Request() req: any) { return this.svc.getCrossModuleView(qualityRecordId, req.user.companyId); }
}
