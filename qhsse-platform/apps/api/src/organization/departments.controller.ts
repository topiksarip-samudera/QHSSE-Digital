import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryOrgDto } from './dto/query-org.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Get()
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'List all departments' })
  findAll(@Query() query: QueryOrgDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get(':id')
  @RequiredPermissions('organization.view')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.sub, user.isSuperAdmin);
  }

  @Post()
  @RequiredPermissions('organization.create')
  @ApiOperation({ summary: 'Create a new department' })
  create(@Body() dto: CreateDepartmentDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('organization.update')
  @ApiOperation({ summary: 'Update a department' })
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.sub, user.isSuperAdmin);
  }

  @Delete(':id')
  @RequiredPermissions('organization.delete')
  @ApiOperation({ summary: 'Soft delete a department' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.sub, user.isSuperAdmin);
  }
}
