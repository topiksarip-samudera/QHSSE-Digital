import { IsString, IsOptional, IsInt, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ActivityDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() routine?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nonRoutine?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() emergency?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateHiradcDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiProperty() @IsString() assessorId: string;
  @ApiPropertyOptional({ type: [ActivityDto] }) @IsOptional() @IsArray() @Type(() => ActivityDto) activities?: ActivityDto[];
}

class HazardDto {
  @ApiProperty() @IsString() hazardDescription: string;
  @ApiPropertyOptional() @IsOptional() @IsString() consequence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() existingControls?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() additionalControls?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() residualSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() residualLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() pic?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}

export class AddHazardDto {
  @ApiProperty() @IsString() activityId: string;
  @ApiProperty() @IsString() hazardDescription: string;
  @ApiPropertyOptional() @IsOptional() @IsString() consequence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() existingControls?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() initialLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() additionalControls?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() residualSeverity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() residualLikelihood?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() pic?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}
