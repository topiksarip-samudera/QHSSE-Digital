import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrequalificationDto {
  @ApiPropertyOptional() @IsString() @IsOptional() category?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() riskLevel?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() score?: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() comments?: string;
}

export class UpdatePrequalificationDto {
  @ApiPropertyOptional() @IsString() @IsOptional() category?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() riskLevel?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() score?: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() comments?: string;
}

export class UpdatePrequalStatusDto {
  @ApiProperty() @IsString() status: string; // pending, approved, rejected
  @ApiPropertyOptional() @IsNumber() @IsOptional() score?: number;
}

export class PrequalificationQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
