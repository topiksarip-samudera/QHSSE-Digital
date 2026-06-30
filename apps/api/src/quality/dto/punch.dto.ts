import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePunchListDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['low','medium','high','critical']) priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
}

export class UpdatePunchListDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['low','medium','high','critical']) priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['open','resolved','verified','closed']) status?: string;
}

export class CreateDefectDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiProperty() @IsString() defectType: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['minor','major','critical']) severity?: string;
  @ApiProperty() @IsDateString() foundDate: string;
  @ApiProperty() @IsString() foundBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
}

export class UpdateDefectDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() defectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['minor','major','critical']) severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['open','in_progress','resolved','closed']) status?: string;
}
