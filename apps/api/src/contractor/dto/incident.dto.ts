import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty() @IsString() incidentType: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() severity?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() incidentDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() reportedBy?: string;
}

export class UpdateIncidentDto {
  @ApiPropertyOptional() @IsString() @IsOptional() incidentType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() title?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() severity?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() incidentDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
}

export class IncidentQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() severity?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() incidentType?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
