import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVisitorDto {
  @ApiProperty() @IsString() visitorName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purpose?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hostName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hostId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() badgeNumber?: string;
}

export class UpdateVisitorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() visitorName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purpose?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hostName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hostId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() badgeNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class VisitorQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
