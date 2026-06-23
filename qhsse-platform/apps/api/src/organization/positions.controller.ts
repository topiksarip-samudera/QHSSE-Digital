import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Positions')
@ApiBearerAuth()
@Controller('positions')
export class PositionsController {
  constructor(private readonly service: PositionsService) {}

  @Get()
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'List all positions' })
  findAll(@Query() query: QueryOrgDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get(':id')
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'Get position by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.sub, user.isSuperAdmin);
  }

  @Post()
  @RequiredPermissions('organization.create')
  @ApiOperation({ summary: 'Create a new position' })
  create(@Body() dto: CreatePositionDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('organization.update')
  @ApiOperation({ summary: 'Update a position' })
  update(@Param('id') id: string, @Body() dto: UpdatePositionDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.sub, user.isSuperAdmin);
  }

  @Delete(':id')
  @RequiredPermissions('organization.delete')
  @ApiOperation({ summary: 'Soft delete a position' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.sub, user.isSuperAdmin);
  }
}
