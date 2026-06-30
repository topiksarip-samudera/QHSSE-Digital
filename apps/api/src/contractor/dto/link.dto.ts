import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty() @IsString() linkedModule: string;
  @ApiProperty() @IsString() linkedRecordId: string;
  @ApiProperty() @IsString() linkedRecordType: string;
}

export class LinkQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() linkedModule?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
