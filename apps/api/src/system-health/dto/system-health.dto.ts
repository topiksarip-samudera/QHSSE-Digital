import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAlertRuleDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() metric: string;
  @ApiPropertyOptional() @IsOptional() @IsString() operator?: string;
  @ApiProperty() @IsNumber() threshold: number;
}

export class QueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
