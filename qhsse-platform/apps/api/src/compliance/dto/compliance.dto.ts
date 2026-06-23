import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccessReviewDto { @ApiProperty() @IsString() userId: string; @ApiPropertyOptional() @IsOptional() access?: any; @ApiPropertyOptional() @IsOptional() @IsString() notes?: string; }
export class CreatePermissionReviewDto { @ApiProperty() @IsString() roleId: string; @ApiPropertyOptional() @IsOptional() @IsString() findings?: string; }
export class AcknowledgePolicyDto { @ApiProperty() @IsString() policyName: string; @ApiPropertyOptional() @IsOptional() @IsInt() version?: number; }
