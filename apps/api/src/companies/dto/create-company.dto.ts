import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'clxtenant001', description: 'Tenant ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'PT Pertamina QHSSE', description: 'Company name' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'PERT-QHSSE', description: 'Unique company code' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ example: 'PT Pertamina (Persero)' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  legalName?: string;

  @ApiPropertyOptional({ example: 'Oil & Gas' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ enum: ['small', 'medium', 'large', 'enterprise'] })
  @IsOptional()
  @IsEnum(['small', 'medium', 'large', 'enterprise'])
  size?: string;

  @ApiPropertyOptional({ example: 'Jl. Medan Merdeka Timur 1A' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Indonesia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '10110' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: '+62-21-1234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'qhsse@pertamina.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://pertamina.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 'Asia/Jakarta', default: 'Asia/Jakarta' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'id', default: 'id' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'DD/MM/YYYY', default: 'DD/MM/YYYY' })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  @ApiPropertyOptional({ example: 'IDR', default: 'IDR' })
  @IsOptional()
  @IsString()
  currency?: string;
}
