import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBadgeDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() badgeNumber: string;
  @ApiPropertyOptional() @IsOptional() @IsString() badgeType?: string;
  @ApiProperty() @IsDateString() issuedDate: string;
  @ApiProperty() @IsDateString() expiryDate: string;
}

export class UpdateBadgeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() badgeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() issuedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class BadgeQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() badgeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
