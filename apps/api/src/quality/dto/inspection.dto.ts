import { IsString, IsOptional, IsInt, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItpDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() itpNumber: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() revision?: number;
}

export class UpdateItpDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itpNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() revision?: number;
  @ApiPropertyOptional() @IsOptional() @IsIn(['draft','approved','active']) status?: string;
}

export class CreateInspectionResultDto {
  @ApiProperty() @IsString() itpId: string;
  @ApiProperty() @IsString() inspectionPoint: string;
  @ApiProperty() @IsString() criteria: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() measuredValue?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['pass','fail']) passFail?: string;
  @ApiProperty() @IsString() inspectorId: string;
  @ApiProperty() @IsDateString() inspectedAt: string;
}

export class UpdateInspectionResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() inspectionPoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() criteria?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() measuredValue?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['pass','fail']) passFail?: string;
}
