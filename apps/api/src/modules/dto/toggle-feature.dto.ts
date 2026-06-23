import { IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToggleFeatureDto {
  @ApiProperty({ description: 'Whether the feature is enabled' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiPropertyOptional({ description: 'Feature configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
