import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePatrolDto {
  @ApiProperty() @IsString() patrolArea: string;
  @ApiProperty() @IsString() checkpointName: string;
  @ApiProperty() @Type(() => Number) @IsInt() checkpointOrder: number;
  @ApiProperty() @IsDateString() scheduledTime: string;
  @ApiProperty() @IsString() patrolledBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdatePatrolDto {
  @ApiPropertyOptional() @IsOptional() @IsString() patrolArea?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checkpointName?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() checkpointOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() actualTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class PatrolQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() patrolArea?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
