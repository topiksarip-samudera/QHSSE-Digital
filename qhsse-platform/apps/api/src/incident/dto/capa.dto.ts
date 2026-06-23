import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCapaDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() assignedTo: string;
  @ApiProperty() @IsString() actionType: string; // corrective, preventive
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCauseId?: string;
}

export class EffectivenessReviewDto {
  @ApiProperty() @IsBoolean() effective: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
