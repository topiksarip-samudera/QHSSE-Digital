import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiProperty() @IsString() reason: string;
  @ApiPropertyOptional() @IsString() @IsOptional() workerId?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() reviewDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class UpdateWatchlistDto {
  @ApiPropertyOptional() @IsString() @IsOptional() reason?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() reviewDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class WatchlistQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
