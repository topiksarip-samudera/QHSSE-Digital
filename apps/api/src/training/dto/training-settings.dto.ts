import { IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireCompetencyCheck?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() defaultTrainingDueDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoAssignFromMatrix?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() certificateExpiryWarningDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() inductionFrequencyMonths?: number;
}
