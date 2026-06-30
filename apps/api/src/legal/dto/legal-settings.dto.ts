import { IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLegalSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() defaultComplianceDueDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireEvidence?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoEscalateOverdue?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() escalationDays?: number;
}
