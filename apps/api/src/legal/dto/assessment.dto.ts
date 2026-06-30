import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() obligationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regulationId?: string;
  @ApiProperty() @IsString() result: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() actionRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() actionId?: string;
}

export class CreateGapAnalysisDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assessmentId?: string;
  @ApiProperty() @IsString() regulationId: string;
  @ApiProperty() @IsString() gapDescription: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remediationPlan?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class UpdateGapDto {
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remediationPlan?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}
