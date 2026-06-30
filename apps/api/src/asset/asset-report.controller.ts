import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AssetService } from './asset.service';

@ApiTags('Asset Report') @ApiBearerAuth() @Controller('asset')
export class AssetReportController {
  constructor(private readonly svc: AssetService) {}

  @Get('export') @RequiredPermissions('asset.export')
  @ApiOperation({ summary: 'Export asset data as JSON (supports type=register|certificates|inspections|maintenance)' })
  async export(@Query('type') type: string, @Request() req: any) { return this.svc.exportAssets(req.user.companyId, type); }
}
