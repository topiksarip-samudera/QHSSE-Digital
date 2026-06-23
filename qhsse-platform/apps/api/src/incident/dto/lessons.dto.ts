import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEscalationRuleDto {
  @ApiProperty() @IsString() severity: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() escalateAfterMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() escalateToRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalateToUser?: string;
}

export class CreateLessonsLearnedDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
}
