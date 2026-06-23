import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Company ID' })
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @ApiPropertyOptional({ description: 'Site ID (null = company-level)' })
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiProperty({ description: 'Department name' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Department code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Head user ID' })
  @IsOptional()
  @IsString()
  headId?: string;

  @ApiPropertyOptional({ description: 'Parent department ID for hierarchy' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
