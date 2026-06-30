import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDispositionDto {
  @ApiProperty() @IsString() ncrId: string;
  @ApiProperty() @IsString() dispositionType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
