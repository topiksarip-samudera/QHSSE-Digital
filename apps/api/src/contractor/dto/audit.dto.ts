import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditInspectionDto {
  @ApiProperty() @IsString() auditInspectionType: string;
  @ApiPropertyOptional() @IsString() @IsOptional() auditorId?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() date?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() result?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() findingsCount?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() actionRequired?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class UpdateAuditInspectionDto {
  @ApiPropertyOptional() @IsString() @IsOptional() result?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() findingsCount?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() actionRequired?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class AuditInspectionQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() result?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() auditInspectionType?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
