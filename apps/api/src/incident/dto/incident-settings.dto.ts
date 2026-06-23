import { IsString, IsOptional, IsBoolean, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SeverityLevelDto {
  @ApiProperty() @IsString() level: string;
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsString() color: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() slaHours?: number;
}

export class UpdateIncidentSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireWorkflow?: boolean;
  @ApiPropertyOptional({ type: [SeverityLevelDto] }) @IsOptional() @IsArray() severityMatrix?: SeverityLevelDto[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoAssignInvestigator?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultInvestigatorRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireAttachment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxReportDays?: number;
}
