import { IsString, IsOptional, IsBoolean, IsObject, IsInt, Min, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class WidgetDto {
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsObject() position?: any;
}

export class CreateDashboardDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() layout?: any;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
  @ApiPropertyOptional({ type: [WidgetDto] }) @IsOptional() @IsArray() @Type(() => WidgetDto) widgets?: WidgetDto[];
}

export class UpdateDashboardDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() layout?: any;
}

export class DashboardQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
