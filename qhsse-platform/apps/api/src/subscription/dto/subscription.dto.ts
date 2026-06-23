import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() interval?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxUsers?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxSites?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxStorage?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() trialDays?: number;
  @ApiPropertyOptional() @IsOptional() features?: { code: string; name: string; value?: string }[];
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class PlanQueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
