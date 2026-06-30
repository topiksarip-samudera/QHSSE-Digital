import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty() @IsString() documentType: string;
  @ApiProperty() @IsString() documentName: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attachmentId?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() issuedDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional() @IsString() @IsOptional() documentType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() documentName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attachmentId?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() issuedDate?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() expiryDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() remarks?: string;
}

export class DocumentQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() documentType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
