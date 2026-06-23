import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateNumberingRuleDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() moduleCode: string;
  @ApiPropertyOptional() @IsOptional() @IsString() prefix?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() suffix?: string;
  @ApiPropertyOptional({ default: 5 }) @IsOptional() @IsInt() @Min(1) digitCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() connector?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resetBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resetValue?: string;
}

export class UpdateNumberingRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() prefix?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() suffix?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) digitCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() connector?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resetBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resetValue?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class NumberingQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() moduleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

export class GenerateNumberDto {
  @ApiProperty() @IsString() recordType: string;
  @ApiProperty() @IsString() recordId: string;
}
