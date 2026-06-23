import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMatrixDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() matrixSize?: number;
  @ApiPropertyOptional({ type: [[Object]] }) @IsOptional() @IsArray() cells?: { severity: number; likelihood: number; riskLevel: string; riskLabel: string; color: string; requiredAction?: string }[];
}

export class PreviewScoreDto {
  @ApiProperty() @IsInt() severity: number;
  @ApiProperty() @IsInt() likelihood: number;
}
