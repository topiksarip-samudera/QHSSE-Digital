import { IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToggleModuleDto {
  @ApiProperty({ description: 'Whether the module is enabled' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiPropertyOptional({ description: 'Module configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
