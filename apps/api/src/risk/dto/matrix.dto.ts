import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMatrixDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() matrixSize?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() cells?: any[];
}

export class PreviewScoreDto {
  @ApiProperty() @IsInt() severity: number;
  @ApiProperty() @IsInt() likelihood: number;
}
