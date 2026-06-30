import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContractorSettingsDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() requirePrequalification?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() defaultRatingPeriodMonths?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() autoFlagHighRisk?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() maxActiveWorkers?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() documentRenewalDays?: number;
}
