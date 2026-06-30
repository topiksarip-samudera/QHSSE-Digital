import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUpdateLogDto {
  @ApiProperty() @IsString() regulationId: string;
  @ApiProperty() @IsString() updateType: string;
  @ApiProperty() @IsString() summary: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() effectiveDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() actionRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() actionId?: string;
}

export class CreateLinkDto {
  @ApiPropertyOptional() @IsOptional() @IsString() regulationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() obligationId?: string;
  @ApiProperty() @IsString() linkedModule: string;
  @ApiProperty() @IsString() linkedRecordId: string;
  @ApiProperty() @IsString() linkedRecordType: string;
}
