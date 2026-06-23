import { Controller, Get, Post, Param, Query, Body, Request, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ImportExportService } from './import-export.service';
import { CreateExportDto, ImportQueryDto } from './dto/import-export.dto';

@ApiTags('Import & Export Center') @ApiBearerAuth() @Controller()
export class ImportExportController {
  constructor(private readonly svc: ImportExportService) {}

  @Post('imports') @RequiredPermissions('import-export-center.create') @UseInterceptors(FileInterceptor('file')) @ApiOperation({ summary: 'Upload import file' })
  async uploadImport(@UploadedFile() file: Express.Multer.File, @Body('moduleCode') moduleCode: string, @Request() req: any) { return this.svc.uploadImport(file, moduleCode, req.user.companyId, req.user.id); }

  @Get('imports') @RequiredPermissions('import-export-center.view') @ApiOperation({ summary: 'Import history' })
  async getImportHistory(@Request() req: any, @Query() q: ImportQueryDto) { return this.svc.getImportHistory(req.user.companyId, q); }

  @Get('imports/:id/preview') @RequiredPermissions('import-export-center.view') @ApiOperation({ summary: 'Preview import data' })
  async getImportPreview(@Param('id') id: string, @Request() req: any) { return this.svc.getImportPreview(id, req.user.companyId); }

  @Post('imports/:id/commit') @RequiredPermissions('import-export-center.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Commit import' })
  async commitImport(@Param('id') id: string, @Request() req: any) { return this.svc.commitImport(id, req.user.companyId); }

  @Post('exports') @RequiredPermissions('import-export-center.export') @ApiOperation({ summary: 'Create export job' })
  async createExport(@Body() dto: CreateExportDto, @Request() req: any) { return this.svc.createExport(dto, req.user.companyId, req.user.id); }

  @Get('exports') @RequiredPermissions('import-export-center.view') @ApiOperation({ summary: 'Export history' })
  async getExportHistory(@Request() req: any, @Query() q: ImportQueryDto) { return this.svc.getExportHistory(req.user.companyId, q); }
}
