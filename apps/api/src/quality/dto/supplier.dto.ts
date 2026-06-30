import { IsString, IsOptional, IsInt, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierQualityDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() supplierName: string;
  @ApiProperty() @IsDateString() receivingDate: string;
  @ApiProperty() @IsString() materialType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lotNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() inspectedQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() defectQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsIn(['accept','reject','conditional']) result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ncrId?: string;
}

export class UpdateSupplierQualityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplierName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() materialType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() inspectedQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() defectQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsIn(['accept','reject','conditional']) result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ncrId?: string;
}

export class CreateMaterialReceivingDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() supplierName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() poNumber?: string;
  @ApiProperty() @IsString() materialName: string;
  @ApiProperty() @IsDateString() receivingDate: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() quantityReceived?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectionResult?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectorId?: string;
}

export class UpdateMaterialReceivingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplierName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() poNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() materialName?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() quantityReceived?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectionResult?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectorId?: string;
}
