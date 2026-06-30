import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePerformanceDto {
  @ApiProperty() @IsString() rating: string;
  @ApiProperty() @IsString() ratingPeriod: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() score?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() comments?: string;
}

export class UpdatePerformanceDto {
  @ApiPropertyOptional() @IsString() @IsOptional() rating?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() ratingPeriod?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() score?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() comments?: string;
}

export class PerformanceQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() rating?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() ratingPeriod?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
