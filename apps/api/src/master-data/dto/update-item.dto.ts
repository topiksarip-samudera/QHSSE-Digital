import { IsString, IsOptional, MaxLength, IsInt, Min, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateItemDto {
  @ApiPropertyOptional({ example: 'High Risk' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ example: 'high' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  value?: string;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Parent item ID' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
