import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, Min, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ description: 'Group ID this item belongs to' })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({ example: 'High', description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'HIGH', description: 'Item code' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ example: 'high', description: 'Item value (for enum-like usage)' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  value?: string;

  @ApiPropertyOptional({ example: 1, description: 'Sort order' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Additional metadata (JSON)' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Company ID for company-specific item. Omit for global.' })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Parent item ID for parent-child relationship' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
