import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkerDto {
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty() @IsString() workerId: string;
  @ApiPropertyOptional() @IsString() @IsOptional() role?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() trainingCompleted?: boolean;
}

export class UpdateWorkerDto {
  @ApiPropertyOptional() @IsString() @IsOptional() fullName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() role?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() trainingCompleted?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() competencyScore?: number;
}

export class WorkerQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}

export class UpdateWorkerStatusDto {
  @ApiProperty() @IsString() status: string;
}

export class CreateWorkerCompetencyDto {
  @ApiProperty() @IsString() competencyType: string;
  @ApiProperty() @IsString() certificationName: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() issuedDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
}

export class UpdateWorkerCompetencyDto {
  @ApiPropertyOptional() @IsString() @IsOptional() competencyType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() certificationName?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() issuedDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
}

export class WorkerCompetencyQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() competencyType?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
