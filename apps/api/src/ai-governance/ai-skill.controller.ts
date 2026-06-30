import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AISkillService } from './ai-skill.service';
import {
  CreateSkillDto,
  UpdateSkillDto,
  ExecuteSkillDto,
  IncidentRcaSkillDto,
  RiskAssessmentSkillDto,
  JsaDraftSkillDto,
  PermitReviewSkillDto,
  ListSkillsQueryDto,
  ListSkillRunsQueryDto,
} from './dto/skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Skills')
@ApiBearerAuth()
@Controller('ai/skills')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AISkillController {
  constructor(private readonly skillService: AISkillService) {}

  @Post()
  @RequiredPermissions('ai.manage_skills')
  @ApiOperation({ summary: 'Create skill' })
  async createSkill(@Request() req, @Body() dto: CreateSkillDto) {
    return this.skillService.createSkill(req.user.companyId, req.user.id, dto);
  }

  @Get()
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List skills' })
  async listSkills(@Request() req, @Query() query: ListSkillsQueryDto) {
    return this.skillService.listSkills(req.user.companyId, query);
  }

  @Get(':skillKey')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get skill' })
  async getSkill(@Request() req, @Param('skillKey') skillKey: string) {
    return this.skillService.getSkill(skillKey, req.user.companyId);
  }

  @Patch(':skillKey')
  @RequiredPermissions('ai.manage_skills')
  @ApiOperation({ summary: 'Update skill' })
  async updateSkill(
    @Request() req,
    @Param('skillKey') skillKey: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.skillService.updateSkill(skillKey, req.user.companyId, dto);
  }

  @Delete(':skillKey')
  @RequiredPermissions('ai.manage_skills')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  async deleteSkill(@Request() req, @Param('skillKey') skillKey: string) {
    return this.skillService.deleteSkill(skillKey, req.user.companyId);
  }

  @Post('execute')
  @RequiredPermissions('ai.chat_with_module_data')
  @ApiOperation({ summary: 'Execute skill' })
  async executeSkill(@Request() req, @Body() dto: ExecuteSkillDto) {
    return this.skillService.executeSkill(req.user.companyId, req.user.id, dto);
  }

  @Get('runs')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'List skill runs' })
  async listRuns(@Request() req, @Query() query: ListSkillRunsQueryDto) {
    return this.skillService.listSkillRuns(req.user.companyId, query);
  }

  @Get('runs/:id')
  @RequiredPermissions('ai.view')
  @ApiOperation({ summary: 'Get skill run' })
  async getRun(@Request() req, @Param('id') id: string) {
    return this.skillService.getSkillRun(id, req.user.companyId);
  }

  @Post('incident-rca')
  @RequiredPermissions('ai.use_incident_assistant')
  @ApiOperation({ summary: 'Execute incident RCA skill' })
  async incidentRca(@Request() req, @Body() dto: IncidentRcaSkillDto) {
    return this.skillService.executeIncidentRca(req.user.companyId, req.user.id, dto);
  }

  @Post('risk-assessment')
  @RequiredPermissions('ai.use_risk_assistant')
  @ApiOperation({ summary: 'Execute risk assessment skill' })
  async riskAssessment(@Request() req, @Body() dto: RiskAssessmentSkillDto) {
    return this.skillService.executeRiskAssessment(req.user.companyId, req.user.id, dto);
  }

  @Post('jsa-draft')
  @RequiredPermissions('ai.use_risk_assistant')
  @ApiOperation({ summary: 'Execute JSA draft skill' })
  async jsaDraft(@Request() req, @Body() dto: JsaDraftSkillDto) {
    return this.skillService.executeJsaDraft(req.user.companyId, req.user.id, dto);
  }

  @Post('permit-review')
  @RequiredPermissions('ai.use_permit_assistant')
  @ApiOperation({ summary: 'Execute permit review skill' })
  async permitReview(@Request() req, @Body() dto: PermitReviewSkillDto) {
    return this.skillService.executePermitReview(req.user.companyId, req.user.id, dto);
  }
}
