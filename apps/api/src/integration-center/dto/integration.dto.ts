import { IsString, IsOptional, IsBoolean, IsObject, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateIntegrationDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() authType?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() credentials?: any;
  @ApiPropertyOptional() @IsOptional() @IsArray() configs?: any[];
  @ApiPropertyOptional() @IsOptional() @IsArray() mappings?: any[];
}

export class QueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
