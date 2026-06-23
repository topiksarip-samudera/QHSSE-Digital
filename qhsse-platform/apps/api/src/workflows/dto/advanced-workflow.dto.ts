import { IsString, IsOptional, IsInt, IsBoolean, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateWorkflowConditionDto {
  @ApiProperty() @IsString() field: string;
  @ApiProperty() @IsString() operator: string;
  @ApiProperty() @IsString() value: string;
  @ApiPropertyOptional() @IsOptional() @IsString() groupId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() logicalOr?: boolean;
}

export class CreateEscalationDto {
  @ApiProperty() @IsString() workflowId: string;
  @ApiProperty() @IsString() stepId: string;
  @ApiProperty() @IsInt() escalateAfterHr: number;
  @ApiPropertyOptional() @IsOptional() @IsString() escalateToRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalateToUser?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxEscalations?: number;
}

export class CreateDelegationDto {
  @ApiProperty() @IsString() delegateId: string;
  @ApiProperty() @IsString() workflowId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stepId?: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class CreateSlaRuleDto {
  @ApiProperty() @IsString() workflowId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stepId?: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsInt() slaHours: number;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() warnAtHour?: number;
}

export class SimulateWorkflowDto {
  @ApiPropertyOptional() @IsOptional() recordData?: Record<string, any>;
}
