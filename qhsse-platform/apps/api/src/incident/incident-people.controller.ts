import { Controller, Get, Post, Patch, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { IncidentService } from './incident.service';
import { AddPersonDto, AddInjuryDto, AddAssetDto, AddPropertyDamageDto, AddEnvironmentalImpactDto } from './dto/incident-people.dto';

@ApiTags('Incident - People & Assets') @ApiBearerAuth() @Controller('incidents')
export class IncidentPeopleController {
  constructor(private readonly svc: IncidentService) {}

  @Get(':id/people') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get people involved' })
  async getPeople(@Param('id') id: string, @Request() req: any) { return this.svc.getPeople(id, req.user.companyId); }
  @Post(':id/people') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Add person' })
  async addPerson(@Param('id') id: string, @Body() dto: AddPersonDto, @Request() req: any) { return this.svc.addPerson(id, dto, req.user.companyId); }
  @Patch(':id/people/:personId') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Update person' })
  async updatePerson(@Param('id') id: string, @Param('personId') personId: string, @Body() data: any, @Request() req: any) { return this.svc.updatePerson(id, personId, data, req.user.companyId); }
  @Delete(':id/people/:personId') @RequiredPermissions('incident.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove person' })
  async deletePerson(@Param('id') id: string, @Param('personId') personId: string, @Request() req: any) { return this.svc.deletePerson(id, personId, req.user.companyId); }

  @Get(':id/injuries') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get injuries' })
  async getInjuries(@Param('id') id: string, @Request() req: any) { return this.svc.getInjuries(id, req.user.companyId); }
  @Post(':id/injuries') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Add injury' })
  async addInjury(@Param('id') id: string, @Body() dto: AddInjuryDto, @Request() req: any) { return this.svc.addInjury(id, dto, req.user.companyId); }

  @Get(':id/assets') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get assets involved' })
  async getAssets(@Param('id') id: string, @Request() req: any) { return this.svc.getAssets(id, req.user.companyId); }
  @Post(':id/assets') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Add asset' })
  async addAsset(@Param('id') id: string, @Body() dto: AddAssetDto, @Request() req: any) { return this.svc.addAsset(id, dto, req.user.companyId); }
  @Delete(':id/assets/:assetId') @RequiredPermissions('incident.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove asset' })
  async deleteAsset(@Param('id') id: string, @Param('assetId') assetId: string, @Request() req: any) { return this.svc.deleteAsset(id, assetId, req.user.companyId); }

  @Get(':id/property-damages') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get property damages' })
  async getPropertyDamages(@Param('id') id: string, @Request() req: any) { return this.svc.getPropertyDamages(id, req.user.companyId); }
  @Post(':id/property-damages') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Add property damage' })
  async addPropertyDamage(@Param('id') id: string, @Body() dto: AddPropertyDamageDto, @Request() req: any) { return this.svc.addPropertyDamage(id, dto, req.user.companyId); }

  @Get(':id/environmental-impacts') @RequiredPermissions('incident.view') @ApiOperation({ summary: 'Get environmental impacts' })
  async getEnvironmental(@Param('id') id: string, @Request() req: any) { return this.svc.getEnvironmentalImpacts(id, req.user.companyId); }
  @Post(':id/environmental-impacts') @RequiredPermissions('incident.update') @ApiOperation({ summary: 'Add environmental impact' })
  async addEnvironmental(@Param('id') id: string, @Body() dto: AddEnvironmentalImpactDto, @Request() req: any) { return this.svc.addEnvironmentalImpact(id, dto, req.user.companyId); }
}
