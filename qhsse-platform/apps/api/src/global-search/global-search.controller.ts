import { Controller, Get, Post, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { GlobalSearchService } from './global-search.service';
import { SearchDto, SavedSearchDto, SearchQueryDto } from './dto/search.dto';

@ApiTags('Global Search') @ApiBearerAuth() @Controller()
export class GlobalSearchController {
  constructor(private readonly svc: GlobalSearchService) {}

  @Get('search') @RequiredPermissions('global-search.view') @ApiOperation({ summary: 'Search across all modules' })
  async search(@Request() req: any, @Query() dto: SearchDto) { return this.svc.search(req.user.companyId, dto); }

  @Post('saved-searches') @RequiredPermissions('global-search.create') @ApiOperation({ summary: 'Save a search' })
  async createSaved(@Body() dto: SavedSearchDto, @Request() req: any) { return this.svc.createSaved(dto, req.user.companyId, req.user.id); }

  @Get('saved-searches') @RequiredPermissions('global-search.view') @ApiOperation({ summary: 'Get saved searches' })
  async getSaved(@Request() req: any, @Query() q: SearchQueryDto) { return this.svc.getSaved(req.user.companyId, req.user.id, q); }

  @Delete('saved-searches/:id') @RequiredPermissions('global-search.delete') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Delete saved search' })
  async deleteSaved(@Param('id') id: string) { return this.svc.deleteSaved(id); }

  @Get('recent-searches') @RequiredPermissions('global-search.view') @ApiOperation({ summary: 'Get recent searches' })
  async getRecent(@Request() req: any) { return this.svc.getRecent(req.user.companyId, req.user.id); }
}
