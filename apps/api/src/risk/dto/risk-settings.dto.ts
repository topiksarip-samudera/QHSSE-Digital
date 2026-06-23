import { IsString, IsOptional, IsBoolean, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRiskSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() matrixType?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireWorkflow?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireAttachment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxReviewDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() severityLevels?: any[];
  @ApiPropertyOptional() @IsOptional() @IsArray() likelihoodLevels?: any[];
  @ApiPropertyOptional() @IsOptional() @IsArray() riskLevels?: any[];
}
