import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityInspectionService } from './quality-inspection.service';
import { CreateMaterialReceivingDto, UpdateMaterialReceivingDto } from './dto/supplier.dto';
import { CreateItpDto, UpdateItpDto, CreateInspectionResultDto, UpdateInspectionResultDto } from './dto/inspection.dto';
import { CreatePunchListDto, UpdatePunchListDto, CreateDefectDto, UpdateDefectDto } from './dto/punch.dto';

@ApiTags('Quality - Material') @ApiBearerAuth() @Controller('quality')
export class QualityMaterialController {
  constructor(private readonly svc: QualityInspectionService) {}

  @Post('material-receiving') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create material receiving record' })
  async create(@Body() dto: CreateMaterialReceivingDto, @Request() req: any) { return this.svc.createMaterialReceiving(dto, req.user.companyId, req.user.id); }

  @Get('material-receiving') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List material receiving records' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllMaterialReceiving(req.user.companyId, query); }

  @Get('material-receiving/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get material receiving detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findMaterialReceiving(id, req.user.companyId); }

  @Patch('material-receiving/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update material receiving' })
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialReceivingDto, @Request() req: any) { return this.svc.updateMaterialReceiving(id, dto, req.user.companyId); }

  @Delete('material-receiving/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete material receiving' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteMaterialReceiving(id, req.user.companyId); }
}

@ApiTags('Quality - ITP') @ApiBearerAuth() @Controller('quality')
export class QualityItpController {
  constructor(private readonly svc: QualityInspectionService) {}

  @Post('itp') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create ITP' })
  async create(@Body() dto: CreateItpDto, @Request() req: any) { return this.svc.createItp(dto, req.user.companyId, req.user.id); }

  @Get('itp') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List ITPs' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllItp(req.user.companyId, query); }

  @Get('itp/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get ITP detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findItp(id, req.user.companyId); }

  @Patch('itp/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update ITP' })
  async update(@Param('id') id: string, @Body() dto: UpdateItpDto, @Request() req: any) { return this.svc.updateItp(id, dto, req.user.companyId); }

  @Delete('itp/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete ITP' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteItp(id, req.user.companyId); }
}

@ApiTags('Quality - Inspection Results') @ApiBearerAuth() @Controller('quality')
export class QualityInspectionResultController {
  constructor(private readonly svc: QualityInspectionService) {}

  @Post('inspection-results') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create inspection result' })
  async create(@Body() dto: CreateInspectionResultDto, @Request() req: any) { return this.svc.createInspectionResult(dto, req.user.companyId, req.user.id); }

  @Get('inspection-results') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List all inspection results' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllResults(req.user.companyId, query); }

  @Get('inspection-results/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get inspection result detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findResult(id, req.user.companyId); }

  @Patch('inspection-results/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update inspection result' })
  async update(@Param('id') id: string, @Body() dto: UpdateInspectionResultDto, @Request() req: any) { return this.svc.updateResult(id, dto, req.user.companyId); }

  @Get('itp/:itpId/results') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List inspection results for ITP' })
  async listByItp(@Param('itpId') itpId: string, @Request() req: any) { return this.svc.findResultsByItp(itpId, req.user.companyId); }
}

@ApiTags('Quality - Punch List') @ApiBearerAuth() @Controller('quality')
export class QualityPunchListController {
  constructor(private readonly svc: QualityInspectionService) {}

  @Post('punch-lists') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create punch list' })
  async create(@Body() dto: CreatePunchListDto, @Request() req: any) { return this.svc.createPunchList(dto, req.user.companyId, req.user.id); }

  @Get('punch-lists') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List punch lists' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllPunchLists(req.user.companyId, query); }

  @Get('punch-lists/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get punch list detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findPunchList(id, req.user.companyId); }

  @Patch('punch-lists/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update punch list' })
  async update(@Param('id') id: string, @Body() dto: UpdatePunchListDto, @Request() req: any) { return this.svc.updatePunchList(id, dto, req.user.companyId); }

  @Delete('punch-lists/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete punch list' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deletePunchList(id, req.user.companyId); }
}

@ApiTags('Quality - Defects') @ApiBearerAuth() @Controller('quality')
export class QualityDefectController {
  constructor(private readonly svc: QualityInspectionService) {}

  @Post('defects') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create defect' })
  async create(@Body() dto: CreateDefectDto, @Request() req: any) { return this.svc.createDefect(dto, req.user.companyId, req.user.id); }

  @Get('defects') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List defects' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllDefects(req.user.companyId, query); }

  @Get('defects/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get defect detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findDefect(id, req.user.companyId); }

  @Patch('defects/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update defect' })
  async update(@Param('id') id: string, @Body() dto: UpdateDefectDto, @Request() req: any) { return this.svc.updateDefect(id, dto, req.user.companyId); }

  @Delete('defects/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete defect' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteDefect(id, req.user.companyId); }
}
