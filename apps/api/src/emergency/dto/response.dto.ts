export class CreateResponseDto {
  actionTaken: string;
  actionBy?: string;
  result?: string;
  notes?: string;
  notificationId?: string;
}

export class UpdateResponseDto {
  actionTaken?: string;
  actionBy?: string;
  result?: string;
  notes?: string;
}

export class ResponseQueryDto {
  incidentId: string;
  page?: number;
  limit?: number;
}
