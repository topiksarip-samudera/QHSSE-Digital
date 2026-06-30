import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIUsageService } from './ai-usage.service';
import {
  ListUsageLogsQueryDto,
  GetUsageCostQueryDto,
  ListGuardrailEventsQueryDto,
  ListAuditLogsQueryDto,
} from './dto/usage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/guards/permissions.guard';

@ApiTags('AI Usage & Analytics')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AIUsageController {
  constructor(private readonly usageService: AIUsageService) {}

  @Get('usage')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'List usage logs' })
  async listUsage(@Request() req, @Query() query: ListUsageLogsQueryDto) {
    return this.usageService.listUsageLogs(req.user.companyId, query);
  }

  @Get('usage/cost')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'Get cost logs' })
  async getCost(@Request() req, @Query() query: GetUsageCostQueryDto) {
    return this.usageService.getCostLogs(req.user.companyId, query);
  }

  @Get('usage/statistics')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'Get usage statistics' })
  async getStatistics(@Request() req, @Query() query: GetUsageCostQueryDto) {
    return this.usageService.getUsageStatistics(req.user.companyId, query);
  }

  @Get('guardrail-events')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'List guardrail events' })
  async listGuardrailEvents(@Request() req, @Query() query: ListGuardrailEventsQueryDto) {
    return this.usageService.listGuardrailEvents(req.user.companyId, query);
  }

  @Get('audit-logs')
  @RequiredPermissions('ai.view_usage')
  @ApiOperation({ summary: 'List AI audit logs' })
  async listAuditLogs(@Request() req, @Query() query: ListAuditLogsQueryDto) {
    return this.usageService.listAuditLogs(req.user.companyId, query);
  }
}
