export class CreateEquipmentDto {
  name: string;
  equipmentCode?: string;
  equipmentType: string;
  location?: string;
  siteId?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  installDate?: string;
  lastInspection?: string;
  nextInspection?: string;
  expiryDate?: string;
  inspectionStatus?: string;
  remarks?: string;
}

export class UpdateEquipmentDto {
  name?: string;
  equipmentCode?: string;
  equipmentType?: string;
  location?: string;
  siteId?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  installDate?: string;
  lastInspection?: string;
  nextInspection?: string;
  expiryDate?: string;
  inspectionStatus?: string;
  remarks?: string;
}

export class EquipmentQueryDto {
  inspectionStatus?: string;
  equipmentType?: string;
  siteId?: string;
  search?: string;
  page?: number;
  limit?: number;
  inspectionOverdue?: boolean;
}
