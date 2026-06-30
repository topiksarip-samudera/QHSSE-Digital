import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSecurityLinkDto {
  @ApiProperty() @IsString() securityRecordId: string;
  @ApiProperty() @IsString() recordType: string;
  @ApiProperty() @IsString() linkedModule: string;
  @ApiProperty() @IsString() linkedRecordId: string;
  @ApiProperty() @IsString() linkedRecordType: string;
}

export class SecurityLinkQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() securityRecordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedModule?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}
