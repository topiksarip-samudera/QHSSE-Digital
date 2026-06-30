export class CreateDrillDto {
  name: string;
  drillCode?: string;
  description?: string;
  drillType: string;
  scenario?: string;
  planId?: string;
  siteId?: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  expectedParticipants?: number;
  observerId?: string;
  evaluatorId?: string;
}

export class UpdateDrillDto {
  name?: string;
  drillCode?: string;
  description?: string;
  drillType?: string;
  scenario?: string;
  planId?: string;
  siteId?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  expectedParticipants?: number;
  observerId?: string;
  evaluatorId?: string;
  status?: string;
}

export class DrillQueryDto {
  status?: string;
  drillType?: string;
  siteId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export class CreateDrillResultDto {
  actualParticipants?: number;
  evacuationTimeSec?: number;
  responseTimeSec?: number;
  attendanceRate?: number;
  score?: number;
  strengths?: string;
  weaknesses?: string;
  findings?: string;
  lessonsLearned?: string;
  observerNotes?: string;
  evaluatorComments?: string;
  correctiveActions?: string;
  verifiedBy?: string;
  reportFileId?: string;
} 
