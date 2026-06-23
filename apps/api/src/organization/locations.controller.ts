import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Locations')
@ApiBearerAuth()
@Controller('locations')
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Get()
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'List all locations' })
  findAll(@Query() query: QueryOrgDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get(':id')
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'Get location by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.sub, user.isSuperAdmin);
  }

  @Post()
  @RequiredPermissions('organization.create')
  @ApiOperation({ summary: 'Create a new location' })
  create(@Body() dto: CreateLocationDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('organization.update')
  @ApiOperation({ summary: 'Update a location' })
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.sub, user.isSuperAdmin);
  }

  @Delete(':id')
  @RequiredPermissions('organization.delete')
  @ApiOperation({ summary: 'Soft delete a location' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.sub, user.isSuperAdmin);
  }
}
