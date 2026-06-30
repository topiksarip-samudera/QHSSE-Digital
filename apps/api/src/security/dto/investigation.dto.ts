import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvestigationDto {
  @ApiProperty() @IsString() incidentId: string;
  @ApiProperty() @IsString() investigatorId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() findings?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() evidence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conclusion?: string;
}

export class UpdateInvestigationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() investigatorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() findings?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() evidence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conclusion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() completedAt?: string;
}

export class InvestigationQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
