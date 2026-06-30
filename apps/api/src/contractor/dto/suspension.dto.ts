import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSuspensionDto {
  @ApiProperty() @IsString() reason: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class UpdateSuspensionDto {
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class SuspensionQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
