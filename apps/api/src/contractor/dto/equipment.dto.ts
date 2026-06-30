import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty() @IsString() equipmentName: string;
  @ApiProperty() @IsString() equipmentType: string;
  @ApiPropertyOptional() @IsString() @IsOptional() registrationNumber?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() inspectionDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() inspectionDue?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class UpdateEquipmentDto {
  @ApiPropertyOptional() @IsString() @IsOptional() equipmentName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() equipmentType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() registrationNumber?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() inspectionDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() inspectionDue?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class EquipmentQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() equipmentType?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}

export class UpdateEquipmentStatusDto {
  @ApiProperty() @IsString() status: string;
}
