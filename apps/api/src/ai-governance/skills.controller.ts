import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { AiChatService } from './chat.service';

@ApiTags('AI Skills') @ApiBearerAuth() @Controller('ai/skills')
export class AiSkillsController {
  constructor(private readonly chat: AiChatService) {}

  private async runSkill(name: string, prompt: string, context: string, req: any) {
    const conv = await this.chat.createConversation({ title: `${name} - ${new Date().toISOString()}`, moduleKey: 'skills' }, req.user.companyId, req.user.id);
    await this.chat.addMessage(conv.id, { role: 'system', content: `You are a ${name} assistant for QHSSE. Context: ${context}` }, req.user.companyId, req.user.id);
    await this.chat.addMessage(conv.id, { role: 'user', content: prompt, tokens: prompt.length }, req.user.companyId, req.user.id);
    return { conversationId: conv.id, skill: name, message: 'Skill initialized. Use conversation to continue.' };
  }

  @Post('incident-rca') @RequiredPermissions('ai.use_incident_assistant') @ApiOperation({ summary: 'Incident RCA assistant' })
  async incidentRca(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Incident RCA', d.prompt, d.context || '', req); }

  @Post('risk-assessment') @RequiredPermissions('ai.use_risk_assistant') @ApiOperation({ summary: 'Risk assessment assistant' })
  async riskAssessment(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Risk Assessment', d.prompt, d.context || '', req); }

  @Post('permit-review') @RequiredPermissions('ai.use_permit_assistant') @ApiOperation({ summary: 'Permit review assistant' })
  async permitReview(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Permit Review', d.prompt, d.context || '', req); }

  @Post('audit-finding') @RequiredPermissions('ai.use_audit_assistant') @ApiOperation({ summary: 'Audit finding assistant' })
  async auditFinding(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Audit Finding', d.prompt, d.context || '', req); }

  @Post('compliance-gap') @RequiredPermissions('ai.use_compliance_assistant') @ApiOperation({ summary: 'Compliance gap assistant' })
  async complianceGap(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Compliance Gap', d.prompt, d.context || '', req); }

  @Post('report-summary') @RequiredPermissions('ai.use_report_assistant') @ApiOperation({ summary: 'Report summary assistant' })
  async reportSummary(@Body() d: { prompt: string; context?: string }, @Request() req: any) { return this.runSkill('Report Summary', d.prompt, d.context || '', req); }
}
