import { Controller, Get, Post, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { CollaborationService } from './collaboration.service';
import { CreateCommentDto, CommentQueryDto } from './dto/collaboration.dto';

@ApiTags('Collaboration & Comments') @ApiBearerAuth() @Controller('records/:module/:recordType/:recordId/comments')
export class CollaborationController {
  constructor(private readonly svc: CollaborationService) {}

  @Get() @RequiredPermissions('collaboration-comment-thread.view') @ApiOperation({ summary: 'Get comments for a record (threaded)' })
  async getComments(@Param('module') module: string, @Param('recordType') recordType: string, @Param('recordId') recordId: string, @Request() req: any, @Query() q: CommentQueryDto) {
    return this.svc.getComments(module, recordType, recordId, req.user.companyId, q);
  }

  @Post() @RequiredPermissions('collaboration-comment-thread.create') @ApiOperation({ summary: 'Add comment or reply' })
  async create(@Param('module') module: string, @Param('recordType') recordType: string, @Param('recordId') recordId: string, @Body() dto: CreateCommentDto, @Request() req: any) {
    return this.svc.create(module, recordType, recordId, dto, req.user.companyId, req.user.id);
  }

  @Delete(':id') @RequiredPermissions('collaboration-comment-thread.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Soft delete comment' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }
}
