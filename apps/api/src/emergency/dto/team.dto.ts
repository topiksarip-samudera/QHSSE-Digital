export class CreateTeamDto {
  name: string;
  teamCode?: string;
  description?: string;
  siteId?: string;
  leaderId?: string;
}

export class UpdateTeamDto {
  name?: string;
  teamCode?: string;
  description?: string;
  siteId?: string;
  leaderId?: string;
  status?: string;
}

export class TeamQueryDto {
  status?: string;
  siteId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class CreateTeamMemberDto {
  userId: string;
  role: string;
  isBackup?: boolean;
  phone?: string;
  email?: string;
}

export class UpdateTeamMemberDto {
  role?: string;
  isBackup?: boolean;
  phone?: string;
  email?: string;
}
