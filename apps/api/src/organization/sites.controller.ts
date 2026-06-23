import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Sites')
@ApiBearerAuth()
@Controller('sites')
export class SitesController {
  constructor(private readonly service: SitesService) {}

  @Get()
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'List all sites' })
  findAll(@Query() query: QueryOrgDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get(':id')
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'Get site by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.sub, user.isSuperAdmin);
  }

  @Post()
  @RequiredPermissions('organization.create')
  @ApiOperation({ summary: 'Create a new site' })
  create(@Body() dto: CreateSiteDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('organization.update')
  @ApiOperation({ summary: 'Update a site' })
  update(@Param('id') id: string, @Body() dto: UpdateSiteDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.sub, user.isSuperAdmin);
  }

  @Delete(':id')
  @RequiredPermissions('organization.delete')
  @ApiOperation({ summary: 'Soft delete a site' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.sub, user.isSuperAdmin);
  }
}
