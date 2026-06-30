import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { DocumentService } from './document.service';

@ApiTags('Document Control - Documents') @ApiBearerAuth() @Controller('documents')
export class DocumentController {
  constructor(private readonly svc: DocumentService) {}

  @Post() @RequiredPermissions('doc.create') @ApiOperation({ summary: 'Create document' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }
  @Get() @RequiredPermissions('doc.view') @ApiOperation({ summary: 'List documents' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }
  @Get(':id') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get document' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }
  @Patch(':id') @RequiredPermissions('doc.update') @ApiOperation({ summary: 'Update draft document' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }
  @Delete(':id') @RequiredPermissions('doc.delete') @ApiOperation({ summary: 'Delete draft document' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }
  @Post(':id/submit') @RequiredPermissions('doc.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit document' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId); }

  // Revisions & Files
  @Post(':id/revisions') @RequiredPermissions('doc.update') @ApiOperation({ summary: 'Create revision' })
  async createRevision(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.createRevision(id, d, req.user.companyId, req.user.id); }
  @Get(':id/revisions') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get revisions' })
  async getRevisions(@Param('id') id: string) { return this.svc.getRevisions(id); }
  @Post(':id/files') @RequiredPermissions('doc.update') @ApiOperation({ summary: 'Add file to document' })
  async addFile(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addFile(id, d, req.user.companyId, req.user.id); }
  @Get(':id/files') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get files' })
  async getFiles(@Param('id') id: string) { return this.svc.getFiles(id); }

  // Review & Approval
  @Post(':id/approve') @RequiredPermissions('doc.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve document' })
  async approve(@Param('id') id: string, @Request() req: any) { return this.svc.approveDocument(id, req.user.companyId, req.user.id); }
  @Post(':id/reject') @RequiredPermissions('doc.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Reject document' })
  async reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) { return this.svc.rejectDocument(id, req.user.companyId, reason); }
  @Post(':id/publish') @RequiredPermissions('doc.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Publish document' })
  async publish(@Param('id') id: string, @Request() req: any) { return this.svc.publishDocument(id, req.user.companyId, req.user.id); }

  // Distribution & Acknowledgement
  @Post(':id/distribute') @RequiredPermissions('doc.update') @ApiOperation({ summary: 'Distribute document' })
  async distribute(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addDistribution(id, d, req.user.companyId); }
  @Get(':id/distributions') @RequiredPermissions('doc.view') @ApiOperation({ summary: 'Get distributions' })
  async getDistributions(@Param('id') id: string) { return this.svc.getDistributions(id); }
  @Post(':id/acknowledge') @RequiredPermissions('doc.view') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Acknowledge document' })
  async acknowledge(@Param('id') id: string, @Request() req: any) { return this.svc.acknowledgeDocument(id, req.user.companyId, req.user.id); }

  // Obsolete & Archive
  @Post(':id/obsolete') @RequiredPermissions('doc.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Mark document obsolete' })
  async obsolete(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) { return this.svc.markObsolete(id, req.user.companyId, reason); }
  @Post(':id/archive') @RequiredPermissions('doc.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Archive document' })
  async archive(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) { return this.svc.archiveDocument(id, req.user.companyId, reason); }
  @Post(':id/restore') @RequiredPermissions('doc.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Restore archived document' })
  async restore(@Param('id') id: string, @Request() req: any) { return this.svc.restoreDocument(id, req.user.companyId); }
}
