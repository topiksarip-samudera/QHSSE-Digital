import { IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermitSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireJsa?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireRiskAssessment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireGasTest?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireLoto?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireSimopsCheck?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxPermitDurationHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireQRVerification?: boolean;
}
