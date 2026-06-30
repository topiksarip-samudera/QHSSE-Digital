import { IsString, IsOptional, IsBoolean, IsObject, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportTemplateDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
}

export class UpdateReportTemplateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateReportScheduleDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiProperty() @IsString() frequency: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recipients?: any[];
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string;
  @ApiPropertyOptional() @IsOptional() nextRun?: string;
}

export class UpdateReportScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recipients?: any[];
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string;
  @ApiPropertyOptional() @IsOptional() nextRun?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateReportRunDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string;
}

export class ReportRunQueryDto {
  @ApiPropertyOptional() @IsOptional() templateId?: string;
  @ApiPropertyOptional() @IsOptional() scheduleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() limit?: number;
}

export class ReportTemplateQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() limit?: number;
}

export class CreateDashboardDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
}

export class UpdateDashboardDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
}

export class DashboardWidgetDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsObject() position?: any;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class DashboardFilterDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() field: string;
  @ApiProperty() @IsString() filterType: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: any;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class DashboardQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() limit?: number;
}

export class UpdateReportSettingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() defaultFormat?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoExport?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() exportRetentionDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxExportRows?: number;
}

export class ReportExportQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() templateId?: string;
}
