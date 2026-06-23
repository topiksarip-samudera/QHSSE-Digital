import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRiskDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() riskOwnerId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskCategoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hazardId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() consequenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() siteId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewFrequency?: string;
}

export class UpdateRiskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() controlSummary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewFrequency?: string;
}

export class RiskQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() siteId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
