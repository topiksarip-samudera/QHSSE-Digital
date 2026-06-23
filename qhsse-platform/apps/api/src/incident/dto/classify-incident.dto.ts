import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ImpactDto {
  @ApiProperty() @IsString() impactType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class ClassifyIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() incidentTypeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actualSeverity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() potentialSeverity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actualConsequence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() potentialConsequence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional({ type: [ImpactDto] }) @IsOptional() @IsArray() impacts?: ImpactDto[];
}
