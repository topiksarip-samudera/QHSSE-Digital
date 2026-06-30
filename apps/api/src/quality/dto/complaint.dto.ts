import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() customerName: string;
  @ApiProperty() @IsDateString() complaintDate: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['low','medium','high','critical']) severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedNcrId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
}

export class UpdateComplaintDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerName?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['low','medium','high','critical']) severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedNcrId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class ComplaintQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
