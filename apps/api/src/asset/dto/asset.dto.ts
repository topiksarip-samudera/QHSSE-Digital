import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssetSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableCriticality?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableCertificateExpiry?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultInspectionFreq?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultMaintenanceFreq?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableQrCode?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableLoto?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireTransferApproval?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requireDisposalApproval?: boolean;
}

export class CreateAssetDto {
  @IsString() assetNumber: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsString() categoryId: string;
  @IsOptional() @IsString() locationId?: string;
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsDateString() purchaseDate?: string;
  @IsOptional() @IsNumber() purchaseCost?: number;
  @IsOptional() @IsDateString() warrantyExpiry?: string;
  @IsOptional() @IsString() ownershipType?: string;
  @IsOptional() @IsString() ownerDepartment?: string;
  @IsOptional() @IsString() custodianId?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() criticalityLevel?: string;
  @IsOptional() @IsString() riskClassification?: string;
  @IsOptional() @IsBoolean() statutoryFlag?: boolean;
}

export class UpdateAssetDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serialNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() purchaseDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() purchaseCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() warrantyExpiry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownershipType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerDepartment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() custodianId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() criticalityLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskClassification?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() statutoryFlag?: boolean;
}

export class AssetQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() criticalityLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateAssetCategoryDto {
  @IsString() name: string;
  @IsString() code: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() parentId?: string;
  @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateAssetCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;
}

export class CreateMaintenanceDto {
  @IsString() assetId: string;
  @IsString() maintenanceType: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() priority?: string;
  @IsDateString() scheduledDate: string;
  @IsOptional() @IsDateString() completedDate?: string;
  @IsOptional() @IsNumber() downtimeHours?: number;
  @IsOptional() @IsNumber() cost?: number;
  @IsOptional() @IsString() performedBy?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateMaintenanceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() completedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() downtimeHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() cost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() performedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class MaintenanceQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() maintenanceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateMaintenanceScheduleDto {
  @IsString() maintenanceId: string;
  @IsString() assetId: string;
  @IsString() frequency: string;
  @IsDateString() nextDueDate: string;
  @IsOptional() @IsDateString() lastDoneDate?: string;
  @IsOptional() @IsNumber() daysBeforeAlert?: number;
}

export class UpdateMaintenanceScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() nextDueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() lastDoneDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() daysBeforeAlert?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateInspectionDto {
  @IsString() assetId: string;
  @IsString() inspectionType: string;
  @IsString() title: string;
  @IsOptional() @IsString() finding?: string;
  @IsOptional() @IsString() result?: string;
  @IsDateString() scheduledDate: string;
  @IsOptional() @IsDateString() completedDate?: string;
  @IsString() inspectorId: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateInspectionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() finding?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() completedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class InspectionQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateCertificateDto {
  @IsString() assetId: string;
  @IsString() certificateType: string;
  @IsString() certificateNo: string;
  @IsString() issuedBy: string;
  @IsDateString() issueDate: string;
  @IsDateString() expiryDate: string;
  @IsOptional() @IsString() attachmentUrl?: string;
}

export class UpdateCertificateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() certificateType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issuedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() issueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachmentUrl?: string;
}

export class CertificateQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateTransferDto {
  @IsString() assetId: string;
  @IsOptional() @IsString() fromLocation?: string;
  @IsString() toLocation: string;
  @IsOptional() @IsString() fromCustodian?: string;
  @IsOptional() @IsString() toCustodian?: string;
  @IsDateString() transferDate: string;
  @IsOptional() @IsString() reason?: string;
}

export class UpdateTransferDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class TransferQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateDisposalDto {
  @IsString() assetId: string;
  @IsString() disposalMethod: string;
  @IsDateString() disposalDate: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsNumber() residualValue?: number;
}

export class UpdateDisposalDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class DisposalQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class CreateAssetLinkDto {
  @IsString() assetId: string;
  @IsString() linkedType: string;
  @IsString() linkedId: string;
}
