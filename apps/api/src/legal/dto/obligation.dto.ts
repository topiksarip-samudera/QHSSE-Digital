import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateObligationDto {
  @ApiProperty() @IsString() regulationId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() article?: string;
  @ApiProperty() @IsString() requirement: string;
  @ApiPropertyOptional() @IsOptional() @IsString() obligationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class UpdateObligationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() regulationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() article?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirement?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() obligationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsibleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class CreateEvidenceDto {
  @ApiProperty() @IsString() obligationId: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() evidenceType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachmentId?: string;
}
