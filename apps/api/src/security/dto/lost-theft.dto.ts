import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLostItemDto {
  @ApiProperty() @IsString() itemName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiProperty() @IsString() reportedBy: string;
  @ApiProperty() @IsDateString() reportDate: string;
}

export class CreateTheftDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemsStolen?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() estimatedValue?: number;
  @ApiProperty() @IsDateString() reportingDate: string;
  @ApiProperty() @IsString() reportedBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
}

export class CreateUnauthorizedAccessDto {
  @ApiProperty() @IsString() accessPoint: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attemptedBy?: string;
  @ApiProperty() @IsDateString() attemptTime: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
}

export class LostItemQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}

export class TheftQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}

export class UnauthorizedAccessQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
