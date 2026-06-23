import { IsString, IsOptional, IsBoolean, IsObject, IsArray, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAccessPolicyDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() module: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() rules?: any;
}

export class CreateTempAccessDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() module: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() access?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiProperty() @IsDateString() expiresAt: string;
}

export class PermissionSimulatorDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() module: string;
  @ApiPropertyOptional() @IsOptional() @IsString() action?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordId?: string;
}

export class PolicyQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() module?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
