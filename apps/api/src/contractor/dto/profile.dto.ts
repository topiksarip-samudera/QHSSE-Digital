import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() contractorCode: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contactPerson?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() email?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contractType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() scopeOfWork?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contactPerson?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() email?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contractType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() scopeOfWork?: string;
}

export class ProfileQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}

export class UpdateProfileStatusDto {
  @ApiProperty() @IsString() status: string;  // prequalified, approved, suspended, blacklisted
}
