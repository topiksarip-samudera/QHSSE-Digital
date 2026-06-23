import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AssignScopeDto } from './dto/assign-scope.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiredPermissions('user.view')
  @ApiOperation({ summary: 'List all users' })
  async findAll(@Query() query: QueryUsersDto, @CurrentUser() user: any) {
    return this.usersService.findAll(query, user.sub, user.isSuperAdmin);
  }

  @Get(':id')
  @RequiredPermissions('user.view')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequiredPermissions('user.create')
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() dto: CreateUserDto, @CurrentUser() user: any) {
    return this.usersService.create(dto, user.sub);
  }

  @Patch(':id')
  @RequiredPermissions('user.update')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: any) {
    return this.usersService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @RequiredPermissions('user.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete user' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user.isSuperAdmin) throw new ForbiddenException('Only super admin can delete users');
    return this.usersService.remove(id, user.sub);
  }

  @Post(':id/activate')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate user' })
  async activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Post(':id/deactivate')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate user' })
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Post(':id/assign-role')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto, @CurrentUser() user: any) {
    return this.usersService.assignRole(id, dto, user.sub);
  }

  @Delete(':id/assign-role/:roleId')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove role from user' })
  async removeRole(
    @Param('id') id: string,
    @Param('roleId') roleId: string,
    @Query('companyId') companyId?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.usersService.removeRole(id, roleId, companyId, siteId);
  }

  @Post(':id/assign-scope')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign scope to user' })
  async assignScope(@Param('id') id: string, @Body() dto: AssignScopeDto) {
    return this.usersService.assignScope(id, dto);
  }

  @Delete('scopes/:scopeId')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove scope from user' })
  async removeScope(@Param('scopeId') scopeId: string) {
    return this.usersService.removeScope(scopeId);
  }

  @Get(':id/login-history')
  @RequiredPermissions('user.view')
  @ApiOperation({ summary: 'Get user login history' })
  async getLoginHistory(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.usersService.getLoginHistory(id, page || 1, pageSize || 20);
  }

  @Post(':id/reset-password')
  @RequiredPermissions('user.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password (admin)' })
  async resetPassword(@Param('id') id: string, @Body() body: { newPassword: string }, @CurrentUser() user: any) {
    if (!user.isSuperAdmin) throw new ForbiddenException('Only super admin can reset passwords');
    return this.usersService.resetPassword(id, body.newPassword);
  }
}
