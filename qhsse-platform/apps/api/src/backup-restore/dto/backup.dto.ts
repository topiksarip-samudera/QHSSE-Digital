import { IsString, IsOptional, IsInt, IsDateString, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBackupDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
}

export class CreateScheduleDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() time?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() retention?: number;
}

export class RestoreRequestDto {
  @ApiProperty() @IsString() backupId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class QueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
