import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum SkillCategory {
  INCIDENT = 'incident',
  RISK = 'risk',
  AUDIT = 'audit',
  PERMIT = 'permit',
  COMPLIANCE = 'compliance',
  REPORT = 'report',
  GENERAL = 'general',
}

export enum SkillRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class CreateSkillDto {
  @IsString()
  skillKey: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory = SkillCategory.GENERAL;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsString()
  promptTemplate: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredPermissions?: string[] = [];

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  promptTemplate?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredPermissions?: string[];

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}

export class ExecuteSkillDto {
  @IsString()
  skillKey: string;

  @IsObject()
  input: Record<string, any>;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsString()
  @IsOptional()
  recordId?: string;
}

// Specific skill execution DTOs

export class IncidentRcaSkillDto {
  @IsString()
  incidentId: string;

  @IsString()
  @IsOptional()
  incidentDescription?: string;

  @IsArray()
  @IsOptional()
  existingFindings?: string[];

  @IsString()
  @IsOptional()
  analysisMethod?: string = '5_why'; // 5_why, fishbone, bow_tie
}

export class RiskAssessmentSkillDto {
  @IsString()
  @IsOptional()
  riskId?: string;

  @IsString()
  hazardDescription: string;

  @IsString()
  activity: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingControls?: string[];
}

export class JsaDraftSkillDto {
  @IsString()
  jobTitle: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hazards?: string[];
}

export class PermitReviewSkillDto {
  @IsString()
  permitId: string;

  @IsString()
  workDescription: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingControls?: string[];
}

export class AuditFindingSkillDto {
  @IsString()
  @IsOptional()
  auditId?: string;

  @IsString()
  checklistItem: string;

  @IsString()
  observation: string;

  @IsString()
  @IsOptional()
  standard?: string;
}

export class CapaRecommendationSkillDto {
  @IsString()
  @IsOptional()
  sourceId?: string;

  @IsString()
  @IsOptional()
  sourceModule?: string;

  @IsString()
  problem: string;

  @IsString()
  rootCause: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingActions?: string[];
}

export class ComplianceGapSkillDto {
  @IsString()
  @IsOptional()
  regulationId?: string;

  @IsString()
  requirement: string;

  @IsString()
  currentState: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingEvidence?: string[];
}

export class ReportSummarySkillDto {
  @IsString()
  moduleKey: string;

  @IsString()
  reportType: string; // monthly, quarterly, executive

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;
}

export class ListSkillsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;

  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
}

export class ListSkillRunsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  skillId?: string;

  @IsEnum(SkillRunStatus)
  @IsOptional()
  status?: SkillRunStatus;

  @IsString()
  @IsOptional()
  moduleKey?: string;
}
