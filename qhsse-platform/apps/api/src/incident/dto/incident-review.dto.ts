import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}

export class AssignInvestigatorDto {
  @ApiProperty() @IsString() investigatorId: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
