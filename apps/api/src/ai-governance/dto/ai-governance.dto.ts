import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAiSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aiEnabled?: boolean;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) allowedModules?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) allowedRoles?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() dataRedaction?: boolean;
}

export class CreatePromptTemplateDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() module: string;
  @ApiProperty() @IsString() prompt: string;
}

export class CreateKnowledgeSourceDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceUrl?: string;
}

export class CreateOutputReviewDto {
  @ApiProperty() @IsString() usageLogId: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approved?: boolean;
}

export class QueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() limit?: number;
}
