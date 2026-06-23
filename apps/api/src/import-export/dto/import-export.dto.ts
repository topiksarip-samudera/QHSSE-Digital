import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateExportDto {
  @ApiProperty() @IsString() moduleCode: string;
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string;
  @ApiPropertyOptional() @IsOptional() filter?: any;
}

export class ImportQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() moduleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
