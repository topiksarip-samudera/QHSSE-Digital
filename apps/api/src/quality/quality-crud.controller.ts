import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { QualityService } from './quality.service';
import { CreateNcrDto, UpdateNcrDto, NcrQueryDto } from './dto/ncr.dto';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintQueryDto } from './dto/complaint.dto';
import { CreateSupplierQualityDto, UpdateSupplierQualityDto } from './dto/supplier.dto';
import { CreateDispositionDto } from './dto/disposition.dto';

@ApiTags('Quality - NCR') @ApiBearerAuth() @Controller('quality')
export class QualityNcrController {
  constructor(private readonly svc: QualityService) {}

  @Post('ncr') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create NCR' })
  async create(@Body() dto: CreateNcrDto, @Request() req: any) { return this.svc.createNcr(dto, req.user.companyId, req.user.id); }

  @Get('ncr') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List NCRs' })
  async list(@Query() query: NcrQueryDto, @Request() req: any) { return this.svc.findAllNcr(req.user.companyId, query); }

  @Get('ncr/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get NCR detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findNcr(id, req.user.companyId); }

  @Patch('ncr/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update NCR' })
  async update(@Param('id') id: string, @Body() dto: UpdateNcrDto, @Request() req: any) { return this.svc.updateNcr(id, dto, req.user.companyId); }

  @Delete('ncr/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete NCR' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteNcr(id, req.user.companyId); }

  @Post('ncr/:id/submit') @RequiredPermissions('quality.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit NCR' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submitNcr(id, req.user.companyId); }

  @Post('ncr/:id/review') @RequiredPermissions('quality.review') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Review NCR' })
  async review(@Param('id') id: string, @Request() req: any) { return this.svc.reviewNcr(id, req.user.companyId); }

  @Post('ncr/:id/verify') @RequiredPermissions('quality.verify') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Verify NCR' })
  async verify(@Param('id') id: string, @Request() req: any) { return this.svc.verifyNcr(id, req.user.companyId); }

  @Post('ncr/:id/close') @RequiredPermissions('quality.close') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Close NCR' })
  async close(@Param('id') id: string, @Request() req: any) { return this.svc.closeNcr(id, req.user.companyId); }
}

@ApiTags('Quality - Complaints') @ApiBearerAuth() @Controller('quality')
export class QualityComplaintController {
  constructor(private readonly svc: QualityService) {}

  @Post('complaints') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create customer complaint' })
  async create(@Body() dto: CreateComplaintDto, @Request() req: any) { return this.svc.createComplaint(dto, req.user.companyId, req.user.id); }

  @Get('complaints') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List complaints' })
  async list(@Query() query: ComplaintQueryDto, @Request() req: any) { return this.svc.findAllComplaints(req.user.companyId, query); }

  @Get('complaints/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get complaint detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findComplaint(id, req.user.companyId); }

  @Patch('complaints/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update complaint' })
  async update(@Param('id') id: string, @Body() dto: UpdateComplaintDto, @Request() req: any) { return this.svc.updateComplaint(id, dto, req.user.companyId); }

  @Delete('complaints/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete complaint' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteComplaint(id, req.user.companyId); }
}

@ApiTags('Quality - Supplier') @ApiBearerAuth() @Controller('quality')
export class QualitySupplierController {
  constructor(private readonly svc: QualityService) {}

  @Post('supplier') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create supplier quality record' })
  async create(@Body() dto: CreateSupplierQualityDto, @Request() req: any) { return this.svc.createSupplierQuality(dto, req.user.companyId, req.user.id); }

  @Get('supplier') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List supplier quality records' })
  async list(@Query() query: any, @Request() req: any) { return this.svc.findAllSupplierQuality(req.user.companyId, query); }

  @Get('supplier/:id') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'Get supplier quality detail' })
  async get(@Param('id') id: string, @Request() req: any) { return this.svc.findSupplierQuality(id, req.user.companyId); }

  @Patch('supplier/:id') @RequiredPermissions('quality.update') @ApiOperation({ summary: 'Update supplier quality record' })
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierQualityDto, @Request() req: any) { return this.svc.updateSupplierQuality(id, dto, req.user.companyId); }

  @Delete('supplier/:id') @RequiredPermissions('quality.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete supplier quality record' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.deleteSupplierQuality(id, req.user.companyId); }
}

@ApiTags('Quality - Disposition') @ApiBearerAuth() @Controller('quality')
export class QualityDispositionController {
  constructor(private readonly svc: QualityService) {}

  @Post('dispositions') @RequiredPermissions('quality.create') @ApiOperation({ summary: 'Create disposition' })
  async create(@Body() dto: CreateDispositionDto, @Request() req: any) { return this.svc.createDisposition(dto, req.user.companyId, req.user.id); }

  @Get('ncr/:ncrId/dispositions') @RequiredPermissions('quality.view') @ApiOperation({ summary: 'List dispositions for NCR' })
  async listByNcr(@Param('ncrId') ncrId: string, @Request() req: any) { return this.svc.findDispositionsByNcr(ncrId, req.user.companyId); }
}
