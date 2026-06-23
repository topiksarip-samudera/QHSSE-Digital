import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRolesDto } from './dto/query-roles.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequiredPermissions('role.view')
  @ApiOperation({ summary: 'List all roles' })
  async findAll(@Query() query: QueryRolesDto, @CurrentUser() user: any) {
    return this.rolesService.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get('permissions')
  @RequiredPermissions('role.view')
  @ApiOperation({ summary: 'Get all permissions (flat list)' })
  async getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Get('permissions/matrix')
  @RequiredPermissions('role.view')
  @ApiOperation({ summary: 'Get permission matrix grouped by module' })
  async getPermissionMatrix() {
    return this.rolesService.getPermissionMatrix();
  }

  @Get(':id')
  @RequiredPermissions('role.view')
  @ApiOperation({ summary: 'Get role by ID with permissions and user count' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Get(':id/permissions')
  @RequiredPermissions('role.view')
  @ApiOperation({ summary: 'Get role permissions' })
  async getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(id);
  }

  @Post()
  @RequiredPermissions('role.create')
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() dto: CreateRoleDto, @CurrentUser() user: any) {
    return this.rolesService.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('role.update')
  @ApiOperation({ summary: 'Update role' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @CurrentUser() user: any) {
    return this.rolesService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @RequiredPermissions('role.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete role' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.rolesService.remove(id, user.sub);
  }

  @Post(':id/permissions')
  @RequiredPermissions('role.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set role permissions (replace all)' })
  async setRolePermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.setRolePermissions(id, dto);
  }

  @Post(':id/permissions/add')
  @RequiredPermissions('role.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add permissions to role (append)' })
  async addRolePermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.addRolePermissions(id, dto);
  }

  @Delete(':id/permissions/:permissionId')
  @RequiredPermissions('role.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  async removeRolePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removeRolePermission(id, permissionId);
  }
}
