import { IsString, IsOptional, IsBoolean, IsInt, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRcaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() causeCategoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() systemCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
}

export class Add5WhyDto {
  @ApiProperty() @IsString() rootCauseId: string;
  @ApiProperty() @IsInt() stepOrder: number;
  @ApiProperty() @IsString() question: string;
  @ApiProperty() @IsString() answer: string;
}

export class AddFishboneDto {
  @ApiProperty() @IsString() rootCauseId: string;
  @ApiProperty() @IsString() category: string;
  @ApiProperty() @IsString() cause: string;
}

export class AddFactorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() rootCauseId?: string;
  @ApiProperty() @IsString() factorType: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contribution?: string;
}

export class ReviewRcaDto {
  @ApiProperty() @IsString() status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
