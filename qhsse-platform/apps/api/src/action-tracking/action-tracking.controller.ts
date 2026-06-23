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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { ActionTrackingService } from './action-tracking.service';
import {
  CreateActionDto,
  UpdateActionDto,
  ActionQueryDto,
  CreateCommentDto,
  VerifyActionDto,
} from './dto/action-tracking.dto';

@ApiTags('Action Tracking')
@ApiBearerAuth()
@Controller('actions')
export class ActionTrackingController {
  constructor(private readonly actionService: ActionTrackingService) {}

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  @Post()
  @RequiredPermissions('action-tracking-basic.create')
  @ApiOperation({ summary: 'Create a new action' })
  async create(@Body() dto: CreateActionDto, @Request() req: any) {
    return this.actionService.create(dto, req.user.companyId, req.user.id);
  }

  @Get()
  @RequiredPermissions('action-tracking-basic.view')
  @ApiOperation({ summary: 'List actions (paginated, filterable)' })
  async findAll(@Request() req: any, @Query() query: ActionQueryDto) {
    return this.actionService.findAll(req.user.companyId, query);
  }

  @Get(':id')
  @RequiredPermissions('action-tracking-basic.view')
  @ApiOperation({ summary: 'Get action detail (includes comments, evidence, history, verifications)' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.actionService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @RequiredPermissions('action-tracking-basic.update')
  @ApiOperation({ summary: 'Update action' })
  async update(@Param('id') id: string, @Body() dto: UpdateActionDto, @Request() req: any) {
    return this.actionService.update(id, dto, req.user.companyId, req.user.id);
  }

  @Delete(':id')
  @RequiredPermissions('action-tracking-basic.delete')
  @ApiOperation({ summary: 'Soft delete an action' })
  async softDelete(@Param('id') id: string, @Request() req: any) {
    return this.actionService.softDelete(id, req.user.companyId, req.user.id);
  }

  // ─── Comments ───────────────────────────────────────────────────────────────

  @Post(':id/comment')
  @RequiredPermissions('action-tracking-basic.update')
  @ApiOperation({ summary: 'Add a comment to an action' })
  async addComment(@Param('id') id: string, @Body() dto: CreateCommentDto, @Request() req: any) {
    return this.actionService.addComment(id, dto, req.user.companyId, req.user.id);
  }

  // ─── Evidence ───────────────────────────────────────────────────────────────

  @Post(':id/evidence/:attachmentId')
  @RequiredPermissions('action-tracking-basic.update')
  @ApiOperation({ summary: 'Link evidence (attachment) to an action' })
  async addEvidence(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Body('description') description: string,
    @Request() req: any,
  ) {
    return this.actionService.addEvidence(id, attachmentId, req.user.companyId, req.user.id, description);
  }

  @Delete(':id/evidence/:evidenceId')
  @RequiredPermissions('action-tracking-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove evidence link' })
  async removeEvidence(
    @Param('id') id: string,
    @Param('evidenceId') evidenceId: string,
    @Request() req: any,
  ) {
    return this.actionService.removeEvidence(evidenceId, req.user.companyId);
  }

  // ─── Verification ───────────────────────────────────────────────────────────

  @Post(':id/submit-verification')
  @RequiredPermissions('action-tracking-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit action for verification' })
  async submitForVerification(@Param('id') id: string, @Request() req: any) {
    return this.actionService.submitForVerification(id, req.user.companyId, req.user.id);
  }

  @Post(':id/verify')
  @RequiredPermissions('action-tracking-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify and close an action' })
  async verify(@Param('id') id: string, @Body() dto: VerifyActionDto, @Request() req: any) {
    return this.actionService.verify(id, dto, req.user.companyId, req.user.id);
  }

  @Post(':id/reject')
  @RequiredPermissions('action-tracking-basic.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject an action verification' })
  async rejectVerification(@Param('id') id: string, @Body() dto: VerifyActionDto, @Request() req: any) {
    return this.actionService.rejectVerification(id, dto, req.user.companyId, req.user.id);
  }
}
