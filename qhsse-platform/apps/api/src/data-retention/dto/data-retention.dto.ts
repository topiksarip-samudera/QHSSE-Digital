import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() module: string;
  @ApiProperty() @IsInt() retentionDays: number;
  @ApiPropertyOptional() @IsOptional() @IsString() action?: string;
}

export class CreateLegalHoldDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() module: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordType?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) recordIds?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class CreatePurgeRequestDto {
  @ApiProperty() @IsString() module: string;
  @ApiProperty() @IsString() recordType: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) recordIds: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}
