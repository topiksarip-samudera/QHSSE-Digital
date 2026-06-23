import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvestigationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sceneCondition?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() directCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() immediateCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() basicCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conclusion?: string;
}

export class AddTeamMemberDto {
  @ApiProperty() @IsString() userId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
}

export class AddChronologyDto {
  @ApiProperty() @IsDateString() eventTime: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
}

export class AddInterviewDto {
  @ApiProperty() @IsString() interviewee: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class AddBarrierDto {
  @ApiProperty() @IsString() barrierType: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() consequence?: string;
}

export class AddFindingDto {
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
}
