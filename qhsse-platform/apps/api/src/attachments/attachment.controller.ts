import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AttachmentService } from './attachment.service';
import {
  UploadAttachmentDto,
  UpdateAttachmentDto,
  AttachmentQueryDto,
  BulkDeleteDto,
  CreateFileLinkDto,
} from './dto/create-attachment.dto';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  // ─── Upload ─────────────────────────────────────────────────────────────────

  @Post('upload')
  @RequiredPermissions('attachment-evidence-basic.create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        recordType: { type: 'string' },
        recordId: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['file', 'recordType', 'recordId'],
    },
  })
  @ApiOperation({ summary: 'Upload a file attachment' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadAttachmentDto,
    @Request() req: any,
  ) {
    return this.attachmentService.upload(file, dto, req.user.companyId, req.user.id);
  }

  // ─── List All (paginated) ───────────────────────────────────────────────────

  @Get()
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'List all attachments for company' })
  async findAll(@Request() req: any, @Query() query: AttachmentQueryDto) {
    return this.attachmentService.findAll(req.user.companyId, query);
  }

  // ─── Get by ID ──────────────────────────────────────────────────────────────

  @Get(':id')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get attachment by ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.attachmentService.findOne(id, req.user.companyId);
  }

  // ─── Download ───────────────────────────────────────────────────────────────

  @Get(':id/download')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Download attachment file' })
  async download(@Param('id') id: string, @Request() req: any, @Res() res: any) {
    const file = await this.attachmentService.getFileForDownload(id, req.user.companyId);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.size,
    });

    const stream = require('fs').createReadStream(file.filePath);
    stream.pipe(res);
  }

  // ─── Get Attachments for a Record ───────────────────────────────────────────

  @Get('record/:recordType/:recordId')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get all attachments for a specific record' })
  async findByRecord(
    @Param('recordType') recordType: string,
    @Param('recordId') recordId: string,
    @Request() req: any,
  ) {
    return this.attachmentService.findByRecord(recordType, recordId, req.user.companyId);
  }

  // ─── Stats ──────────────────────────────────────────────────────────────────

  @Get('stats/overview')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get attachment statistics for company' })
  async getStats(@Request() req: any) {
    return this.attachmentService.getStats(req.user.companyId);
  }

  // ─── Update Metadata ────────────────────────────────────────────────────────

  @Patch(':id')
  @RequiredPermissions('attachment-evidence-basic.update')
  @ApiOperation({ summary: 'Update attachment metadata' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAttachmentDto,
    @Request() req: any,
  ) {
    return this.attachmentService.update(id, dto, req.user.companyId);
  }

  // ─── Soft Delete ────────────────────────────────────────────────────────────

  @Delete(':id')
  @RequiredPermissions('attachment-evidence-basic.delete')
  @ApiOperation({ summary: 'Soft delete an attachment' })
  async softDelete(@Param('id') id: string, @Request() req: any) {
    return this.attachmentService.softDelete(id, req.user.companyId, req.user.id);
  }

  // ─── Bulk Delete ────────────────────────────────────────────────────────────

  @Post('bulk-delete')
  @RequiredPermissions('attachment-evidence-basic.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk soft delete attachments' })
  async bulkDelete(@Body() dto: BulkDeleteDto, @Request() req: any) {
    return this.attachmentService.bulkDelete(dto.ids, req.user.companyId, req.user.id);
  }

  // ─── Restore ────────────────────────────────────────────────────────────────

  @Post(':id/restore')
  @RequiredPermissions('attachment-evidence-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted attachment' })
  async restore(@Param('id') id: string, @Request() req: any) {
    return this.attachmentService.restore(id, req.user.companyId);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FILE LINKS
  // ═══════════════════════════════════════════════════════════════════════════════

  @Post('file-links')
  @RequiredPermissions('attachment-evidence-basic.create')
  @ApiOperation({ summary: 'Create a file link to another record' })
  async createFileLink(@Body() dto: CreateFileLinkDto, @Request() req: any) {
    return this.attachmentService.createFileLink(dto, req.user.companyId, req.user.id);
  }

  @Get(':id/file-links')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get all file links for an attachment' })
  async getFileLinksByAttachment(@Param('id') id: string, @Request() req: any) {
    return this.attachmentService.getFileLinksByAttachment(id, req.user.companyId);
  }

  @Get('file-links/record/:linkedModule/:linkedRecordType/:linkedRecordId')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get file links by record (includes attachment+file)' })
  async getFileLinksByRecord(
    @Param('linkedModule') linkedModule: string,
    @Param('linkedRecordType') linkedRecordType: string,
    @Param('linkedRecordId') linkedRecordId: string,
    @Request() req: any,
  ) {
    return this.attachmentService.getFileLinksByRecord(
      linkedModule,
      linkedRecordType,
      linkedRecordId,
      req.user.companyId,
    );
  }

  @Delete('file-links/:fileLinkId')
  @RequiredPermissions('attachment-evidence-basic.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a file link' })
  async deleteFileLink(@Param('fileLinkId') fileLinkId: string, @Request() req: any) {
    return this.attachmentService.deleteFileLink(fileLinkId, req.user.companyId);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CROSS-MODULE RECORDS ENDPOINT
  // ═══════════════════════════════════════════════════════════════════════════════

  @Get('records/:module/:recordType/:recordId')
  @RequiredPermissions('attachment-evidence-basic.view')
  @ApiOperation({ summary: 'Get attachments for a record across modules (direct + file_links)' })
  async findByRecordCrossModule(
    @Param('module') module: string,
    @Param('recordType') recordType: string,
    @Param('recordId') recordId: string,
    @Request() req: any,
  ) {
    return this.attachmentService.findByRecordCrossModule(
      module,
      recordType,
      recordId,
      req.user.companyId,
    );
  }
}
