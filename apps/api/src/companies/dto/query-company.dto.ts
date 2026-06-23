import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryCompanyDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({ example: 'name' })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ example: 'pertamina' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiPropertyOptional({ example: 'Oil & Gas' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ enum: ['small', 'medium', 'large', 'enterprise'] })
  @IsOptional()
  @IsEnum(['small', 'medium', 'large', 'enterprise'])
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;
}
