import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchDto {
  @ApiProperty() @IsString() query: string;
  @ApiPropertyOptional() @IsOptional() @IsString() module?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fromDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toDate?: string;
}

export class SavedSearchDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() query: string;
  @ApiPropertyOptional() @IsOptional() filters?: any;
}

export class SearchQueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
