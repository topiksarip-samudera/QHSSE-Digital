import { IsString, IsOptional, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ActionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ActionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export class CreateActionDto {
  @ApiProperty({ description: 'Action title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Action description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Assigned user ID' })
  @IsString()
  assignedTo: string;

  @ApiPropertyOptional({ enum: ActionPriority, default: ActionPriority.MEDIUM })
  @IsOptional()
  @IsEnum(ActionPriority)
  priority?: ActionPriority;

  @ApiPropertyOptional({ description: 'Due date (ISO)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Source type (incident, audit, risk, etc)' })
  @IsOptional()
  @IsString()
  sourceType?: string;

  @ApiPropertyOptional({ description: 'Source record ID' })
  @IsOptional()
  @IsString()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Site ID' })
  @IsOptional()
  @IsString()
  siteId?: string;
}

export class UpdateActionDto {
  @ApiPropertyOptional({ description: 'Action title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Action description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Assigned user ID' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ enum: ActionPriority })
  @IsOptional()
  @IsEnum(ActionPriority)
  priority?: ActionPriority;

  @ApiPropertyOptional({ description: 'Due date (ISO)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ActionStatus })
  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;
}

export class ActionQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by priority' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned user ID' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Filter by source type' })
  @IsOptional()
  @IsString()
  sourceType?: string;

  @ApiPropertyOptional({ description: 'Filter overdue only' })
  @IsOptional()
  @Type(() => Boolean)
  overdue?: boolean;

  @ApiPropertyOptional({ description: 'Search in title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  content: string;
}

export class VerifyActionDto {
  @ApiProperty({ description: 'Verification notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
