import { IsString, IsOptional, IsInt, Min, IsBoolean, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FormFieldOptionDto {
  @ApiProperty({ description: 'Option label' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Option value' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class FormConditionDto {
  @ApiProperty({ description: 'Depends on field ID' })
  @IsString()
  dependsOnFieldId: string;

  @ApiProperty({ description: 'Operator: eq, neq, gt, lt, gte, lte, contains, not_contains, empty, not_empty' })
  @IsString()
  operator: string;

  @ApiPropertyOptional({ description: 'Comparison value' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ description: 'Action: show, hide, require, set_value' })
  @IsString()
  action: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionValue?: string;
}

export class FormFieldDto {
  @ApiProperty({ description: 'Field label' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Field key (unique within section)' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Field type: text, number, textarea, select, radio, checkbox, date, file, email, phone' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  repeatable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  minLength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxLength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  minValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  maxValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  formula?: string;

  @ApiPropertyOptional({ type: [FormFieldOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldOptionDto)
  options?: FormFieldOptionDto[];

  @ApiPropertyOptional({ type: [FormConditionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormConditionDto)
  conditions?: FormConditionDto[];
}

export class FormSectionDto {
  @ApiProperty({ description: 'Section title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ type: [FormFieldDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields?: FormFieldDto[];
}

export class CreateFormDto {
  @ApiProperty({ description: 'Form name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Form description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [FormSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSectionDto)
  sections?: FormSectionDto[];
}

export class UpdateFormDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [FormSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSectionDto)
  sections?: FormSectionDto[];
}

export class FormQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search in name or description' })
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

export class SubmitFormDto {
  @ApiProperty({ description: 'Form version ID' })
  @IsString()
  formVersionId: string;

  @ApiProperty({ description: 'Field values: { fieldId: value }' })
  values: Record<string, any>;
}
