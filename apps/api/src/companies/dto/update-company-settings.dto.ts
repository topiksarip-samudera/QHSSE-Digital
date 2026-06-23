import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanySettingsDto {
  @ApiProperty({ example: 'max_upload_size', description: 'Setting key' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ example: '10485760', description: 'Setting value (JSON)' })
  @IsOptional()
  value?: any;

  @ApiPropertyOptional({ example: 'Maximum file upload size in bytes' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class BulkUpdateSettingsDto {
  @ApiProperty({
    example: [
      { key: 'max_upload_size', value: 10485760 },
      { key: 'default_language', value: 'id' },
    ],
  })
  @IsObject({ each: true })
  settings: Array<{ key: string; value: any; description?: string }>;
}
