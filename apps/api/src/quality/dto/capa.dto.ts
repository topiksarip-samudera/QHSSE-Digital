import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCapaDto {
  @ApiProperty() @IsString() capaType: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ncrId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() defectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complaintId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() correctiveAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preventiveAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}

export class UpdateCapaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() correctiveAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preventiveAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['open','in_progress','completed','verified','closed']) status?: string;
}

export class CreateCalibrationDto {
  @ApiProperty() @IsString() equipmentName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() equipmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serialNumber?: string;
  @ApiProperty() @IsDateString() calibrationDate: string;
  @ApiProperty() @IsDateString() calibrationDue: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() standard?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['pass','fail']) result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calibratedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificateNumber?: string;
}

export class UpdateCalibrationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() equipmentName?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() calibrationDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() calibrationDue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() standard?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['pass','fail']) result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calibratedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificateNumber?: string;
}

export class CreateLinkDto {
  @ApiProperty() @IsString() qualityRecordId: string;
  @ApiProperty() @IsString() qualityRecordType: string;
  @ApiProperty() @IsString() linkedModule: string;
  @ApiProperty() @IsString() linkedRecordId: string;
  @ApiProperty() @IsString() linkedRecordType: string;
}
