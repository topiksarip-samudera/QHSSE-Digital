import { IsString, IsOptional, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class LinkedRecordDto {
  @ApiProperty({ description: 'Module name to link (e.g. incident, audit)' })
  @IsString()
  linkedModule: string;

  @ApiProperty({ description: 'Record type to link' })
  @IsString()
  linkedRecordType: string;

  @ApiProperty({ description: 'Record ID to link' })
  @IsString()
  linkedRecordId: string;

  @ApiPropertyOptional({ description: 'Additional link context' })
  @IsOptional()
  @IsString()
  linkContext?: string;
}

export class UploadAttachmentDto {
  @ApiProperty({ description: 'Module name (e.g. incident, audit, workflow)' })
  @IsString()
  recordType: string;

  @ApiProperty({ description: 'Record ID to attach file to' })
  @IsString()
  recordId: string;

  @ApiPropertyOptional({ description: 'Description of the attachment' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional records to link this file to', type: [LinkedRecordDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkedRecordDto)
  linkedRecords?: LinkedRecordDto[];
}

export class CreateFileLinkDto {
  @ApiProperty({ description: 'Attachment ID' })
  @IsString()
  attachmentId: string;

  @ApiProperty({ description: 'Module name to link' })
  @IsString()
  linkedModule: string;

  @ApiProperty({ description: 'Record type to link' })
  @IsString()
  linkedRecordType: string;

  @ApiProperty({ description: 'Record ID to link' })
  @IsString()
  linkedRecordId: string;

  @ApiPropertyOptional({ description: 'Additional link context' })
  @IsOptional()
  @IsString()
  linkContext?: string;
}

export class UpdateAttachmentDto {
  @ApiPropertyOptional({ description: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AttachmentQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recordType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recordId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

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

export class BulkDeleteDto {
  @ApiProperty({ description: 'Array of attachment IDs to delete', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
