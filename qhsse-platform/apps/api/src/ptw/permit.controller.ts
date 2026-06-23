import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { PermitService } from './permit.service';

@ApiTags('PTW - Permits') @ApiBearerAuth() @Controller('permits')
export class PermitController {
  constructor(private readonly svc: PermitService) {}

  @Post() @RequiredPermissions('ptw.create') @ApiOperation({ summary: 'Create permit' })
  async create(@Body() d: any, @Request() req: any) { return this.svc.create(d, req.user.companyId, req.user.id); }

  @Get() @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'List permits' })
  async findAll(@Request() req: any, @Query() q: any) { return this.svc.findAll(req.user.companyId, q); }

  @Get(':id') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get permit detail' })
  async findOne(@Param('id') id: string, @Request() req: any) { return this.svc.findOne(id, req.user.companyId); }

  @Patch(':id') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Update draft permit' })
  async update(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.update(id, d, req.user.companyId); }

  @Delete(':id') @RequiredPermissions('ptw.delete') @ApiOperation({ summary: 'Delete draft permit' })
  async delete(@Param('id') id: string, @Request() req: any) { return this.svc.softDelete(id, req.user.companyId); }

  @Post(':id/submit') @RequiredPermissions('ptw.submit') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Submit permit' })
  async submit(@Param('id') id: string, @Request() req: any) { return this.svc.submit(id, req.user.companyId); }

  @Post(':id/locations') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add work location' })
  async addLocation(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addLocation(id, d, req.user.companyId); }

  @Post(':id/workers') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add worker' })
  async addWorker(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addWorker(id, d, req.user.companyId); }

  @Delete(':id/workers/:workerId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove worker' })
  async removeWorker(@Param('workerId') workerId: string) { return this.svc.removeWorker(workerId); }

  // JSA & Risk Links
  @Post(':id/jsa') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Link JSA to permit' })
  async linkJsa(@Param('id') id: string, @Body('jsaId') jsaId: string, @Request() req: any) { return this.svc.linkJsa(id, jsaId, req.user.companyId); }
  @Post(':id/risk') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Link risk to permit' })
  async linkRisk(@Param('id') id: string, @Body('riskId') riskId: string, @Request() req: any) { return this.svc.linkRisk(id, riskId, req.user.companyId); }
  @Get(':id/links') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get linked JSA/Risk items' })
  async getLinks(@Param('id') id: string, @Request() req: any) { return this.svc.getLinkedItems(id, req.user.companyId); }
  @Delete(':id/jsa/:linkId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Unlink JSA' })
  async unlinkJsa(@Param('linkId') linkId: string, @Request() req: any) { return this.svc.unlinkJsa(linkId, req.user.companyId); }
  @Delete(':id/risk/:linkId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Unlink risk' })
  async unlinkRisk(@Param('linkId') linkId: string, @Request() req: any) { return this.svc.unlinkRisk(linkId, req.user.companyId); }

  // PPE, Tools & Equipment
  @Post(':id/ppe') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add PPE requirement' })
  async addPpe(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addPpe(id, d, req.user.companyId); }
  @Post(':id/tools') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add tool requirement' })
  async addTool(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addTool(id, d, req.user.companyId); }
  @Post(':id/equipment') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add equipment requirement' })
  async addEquipment(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addEquipment(id, d, req.user.companyId); }
  @Get(':id/ppe-tools-equipment') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get all PPE/tools/equipment' })
  async getPpeToolsEquipment(@Param('id') id: string, @Request() req: any) { return this.svc.getPpeToolsEquipment(id, req.user.companyId); }
  @Delete(':id/ppe/:ppeId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove PPE' })
  async removePpe(@Param('ppeId') ppeId: string) { return this.svc.removePpe(ppeId); }
  @Delete(':id/tools/:toolId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove tool' })
  async removeTool(@Param('toolId') toolId: string) { return this.svc.removeTool(toolId); }
  @Delete(':id/equipment/:equipId') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Remove equipment' })
  async removeEquipment(@Param('equipId') equipId: string) { return this.svc.removeEquipment(equipId); }

  // Safety Checks (Competency, Gas Test, LOTO, SIMOPS)
  @Post(':id/competency') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add competency check' })
  async addCompetency(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addCompetency(id, d, req.user.companyId); }
  @Post(':id/gas-test') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add gas test' })
  async addGasTest(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addGasTest(id, d, req.user.companyId); }
  @Post(':id/loto') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add LOTO point' })
  async addLotoPoint(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addLotoPoint(id, d, req.user.companyId); }
  @Post(':id/simops') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Add SIMOPS check' })
  async addSimopsCheck(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.addSimopsCheck(id, d, req.user.companyId); }
  @Get(':id/safety-checks') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get all safety checks' })
  async getSafetyChecks(@Param('id') id: string, @Request() req: any) { return this.svc.getSafetyChecks(id, req.user.companyId); }

  // Workflow: Approve, Activate, Extend, Suspend, Resume, Close
  @Post(':id/approve') @RequiredPermissions('ptw.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Approve permit' })
  async approve(@Param('id') id: string, @Request() req: any) { return this.svc.approve(id, req.user.companyId, req.user.id); }
  @Post(':id/activate') @RequiredPermissions('ptw.approve') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Activate permit' })
  async activate(@Param('id') id: string, @Request() req: any) { return this.svc.activate(id, req.user.companyId, req.user.id); }
  @Post(':id/extend') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Extend permit duration' })
  async extend(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.extend(id, d, req.user.companyId, req.user.id); }
  @Post(':id/suspend') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Suspend permit' })
  async suspend(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.suspend(id, d, req.user.companyId, req.user.id); }
  @Post(':id/resume') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Resume permit' })
  async resume(@Param('id') id: string, @Request() req: any) { return this.svc.resume(id, req.user.companyId, req.user.id); }
  @Post(':id/close') @RequiredPermissions('ptw.update') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Close permit' })
  async close(@Param('id') id: string, @Request() req: any) { return this.svc.close(id, req.user.companyId, req.user.id); }

  // Closeout & Handover
  @Post(':id/closeout') @RequiredPermissions('ptw.update') @ApiOperation({ summary: 'Complete closeout checklist' })
  async closeout(@Param('id') id: string, @Body() d: any, @Request() req: any) { return this.svc.completeCloseout(id, d, req.user.companyId, req.user.id); }
  @Get(':id/closeout') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Get closeout' })
  async getCloseout(@Param('id') id: string, @Request() req: any) { return this.svc.getCloseout(id, req.user.companyId); }

  // Dashboard
  @Get('dashboard') @RequiredPermissions('ptw.view') @ApiOperation({ summary: 'Permit dashboard' })
  async getDashboard(@Request() req: any) { return this.svc.getDashboard(req.user.companyId); }
}
