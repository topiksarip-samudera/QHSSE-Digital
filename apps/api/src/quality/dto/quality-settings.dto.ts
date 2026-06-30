import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateQualitySettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  requireRootCauseMajorNcr?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsInt()
  defaultNcrDueDays?: number;

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  requireDisposition?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  requireCapaVerification?: boolean;
}
