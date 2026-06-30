import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGatePassDto {
  @ApiProperty() @IsString() passNumber: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() driverName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purpose?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entryGate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exitGate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() entryTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() exitTime?: string;
}

export class UpdateGatePassDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() driverName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purpose?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entryGate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exitGate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() entryTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() exitTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class GatePassQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
