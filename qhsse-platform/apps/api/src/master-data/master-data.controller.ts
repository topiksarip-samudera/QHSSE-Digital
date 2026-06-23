import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MasterDataService } from './master-data.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryGroupsDto } from './dto/query-groups.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('Master Data')
@ApiBearerAuth()
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // ─── GROUPS ─────────────────────────────────────────────────────────────

  @Get('groups')
  @RequiredPermissions('master-data.view')
  @ApiOperation({ summary: 'List all master data groups' })
  async findAllGroups(@Query() query: QueryGroupsDto, @CurrentUser() user: any) {
    return this.masterDataService.findAllGroups(query, user.sub, user.isSuperAdmin);
  }

  @Get('groups/:id')
  @RequiredPermissions('master-data.view')
  @ApiOperation({ summary: 'Get group by ID with items' })
  async findOneGroup(@Param('id') id: string) {
    return this.masterDataService.findOneGroup(id);
  }

  @Post('groups')
  @RequiredPermissions('master-data.create')
  @ApiOperation({ summary: 'Create a master data group' })
  async createGroup(@Body() dto: CreateGroupDto, @CurrentUser() user: any) {
    return this.masterDataService.createGroup(dto, user.sub);
  }

  @Patch('groups/:id')
  @RequiredPermissions('master-data.update')
  @ApiOperation({ summary: 'Update a master data group' })
  async updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto, @CurrentUser() user: any) {
    return this.masterDataService.updateGroup(id, dto, user.sub);
  }

  @Delete('groups/:id')
  @RequiredPermissions('master-data.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a master data group' })
  async removeGroup(@Param('id') id: string, @CurrentUser() user: any) {
    return this.masterDataService.removeGroup(id, user.sub);
  }

  // ─── ITEMS ──────────────────────────────────────────────────────────────

  @Get('items')
  @RequiredPermissions('master-data.view')
  @ApiOperation({ summary: 'List all master data items' })
  async findAllItems(@Query() query: QueryItemsDto, @CurrentUser() user: any) {
    return this.masterDataService.findAllItems(query, user.sub, user.isSuperAdmin);
  }

  @Get('items/:id')
  @RequiredPermissions('master-data.view')
  @ApiOperation({ summary: 'Get item by ID' })
  async findOneItem(@Param('id') id: string) {
    return this.masterDataService.findOneItem(id);
  }

  @Post('items')
  @RequiredPermissions('master-data.create')
  @ApiOperation({ summary: 'Create a master data item' })
  async createItem(@Body() dto: CreateItemDto, @CurrentUser() user: any) {
    return this.masterDataService.createItem(dto, user.sub);
  }

  @Patch('items/:id')
  @RequiredPermissions('master-data.update')
  @ApiOperation({ summary: 'Update a master data item' })
  async updateItem(@Param('id') id: string, @Body() dto: UpdateItemDto, @CurrentUser() user: any) {
    return this.masterDataService.updateItem(id, dto, user.sub);
  }

  @Delete('items/:id')
  @RequiredPermissions('master-data.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a master data item' })
  async removeItem(@Param('id') id: string, @CurrentUser() user: any) {
    return this.masterDataService.removeItem(id, user.sub);
  }

  @Post('items/:id/restore')
  @RequiredPermissions('master-data.update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted item' })
  async restoreItem(@Param('id') id: string) {
    return this.masterDataService.restoreItem(id);
  }

  @Get('export')
  @RequiredPermissions('master-data.export')
  @ApiOperation({ summary: 'Export master data items as JSON' })
  async exportItems(
    @Query('groupId') groupId?: string,
    @Query('companyId') companyId?: string,
  ) {
    return this.masterDataService.exportItems(groupId, companyId);
  }
}
