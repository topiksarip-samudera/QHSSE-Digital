import { IsString, IsOptional, IsBoolean, IsObject, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSsoProviderDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() provider: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() mappings?: { claimPath: string; claimValue: string; targetRoleId?: string; targetSiteId?: string; autoProvision?: boolean }[];
}

export class UpdateSsoProviderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class SsoQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
