import { IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuditInspectionSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() defaultFindingDueDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoCreateAction?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireEvidenceMajorNc?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireRootCauseMajorNc?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() scoreFailedCriticalAsZero?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() passScorePercent?: number;
}
