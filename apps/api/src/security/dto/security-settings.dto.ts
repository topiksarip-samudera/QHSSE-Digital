import { IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSecuritySettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireBadgeCheck?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() defaultPatrolFrequencyHrs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() visitorExpiryHrs?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireInvestigation?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoEscalate?: boolean;
}
