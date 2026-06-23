import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddPersonDto {
  @ApiProperty() @IsString() personType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactInfo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() statement?: string;
}

export class AddInjuryDto {
  @ApiProperty() @IsString() personId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() injuryTypeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bodyPart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() treatmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() lostTimeDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() restrictedDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class AddAssetDto {
  @ApiProperty() @IsString() assetType: string;
  @ApiProperty() @IsString() assetName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() damageDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() costEstimate?: number;
}

export class AddPropertyDamageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedCost?: number;
}

export class AddEnvironmentalImpactDto {
  @ApiPropertyOptional() @IsOptional() @IsString() impactType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() substance?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() quantity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() areaAffected?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() containmentAction?: string;
}
