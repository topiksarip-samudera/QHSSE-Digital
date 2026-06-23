import { IsString, IsOptional, IsInt, Min, IsBoolean, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AnswerOptionDto {
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsString() value: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isPass?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

class ChecklistItemDto {
  @ApiProperty() @IsString() question: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() answerType: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() required?: boolean;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() critical?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireEvidence?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireComment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoFinding?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() findingAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional({ type: [AnswerOptionDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AnswerOptionDto) options?: AnswerOptionDto[];
}

class ChecklistSectionDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional({ type: [ChecklistItemDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ChecklistItemDto) items?: ChecklistItemDto[];
}

export class CreateChecklistDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() passScore?: number;
  @ApiPropertyOptional({ type: [ChecklistSectionDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ChecklistSectionDto) sections?: ChecklistSectionDto[];
}

export class UpdateChecklistDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() passScore?: number;
  @ApiPropertyOptional({ type: [ChecklistSectionDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ChecklistSectionDto) sections?: ChecklistSectionDto[];
}

export class ChecklistQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

class ResponseItemDto {
  @ApiProperty() @IsString() itemId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() answer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() evidenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}

export class SubmitChecklistDto {
  @ApiProperty() @IsString() checklistVersionId: string;
  @ApiProperty({ type: [ResponseItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => ResponseItemDto) items: ResponseItemDto[];
}
