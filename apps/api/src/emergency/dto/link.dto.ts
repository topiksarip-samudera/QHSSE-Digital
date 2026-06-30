export class CreateLinkDto {
  emergencyRecordType: string;
  linkedModule: string;
  linkedRecordId: string;
  linkedRecordType: string;
}

export class LinkQueryDto {
  emergencyRecordId?: string;
  emergencyRecordType?: string;
  linkedModule?: string;
  page?: number;
  limit?: number;
}
