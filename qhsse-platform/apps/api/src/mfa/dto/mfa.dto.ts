import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetupMfaDto {
  @ApiProperty() @IsString() method: string; // totp or email_otp
}

export class VerifyMfaDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() method: string;
}

export class DisableMfaDto {
  @ApiProperty() @IsString() password: string;
}

export class MfaSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireMfa?: boolean;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) allowedMethods?: string[];
}
