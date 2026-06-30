export class CreateIncidentDto {
  title: string;
  incidentType: string;
  severity?: string;
  description?: string;
  location?: string;
  siteId?: string;
  incidentDate: string;
  responseTimeMin?: number;
  casualties?: number;
  injuries?: number;
  fatalities?: number;
  damages?: string;
}

export class UpdateIncidentDto {
  title?: string;
  incidentType?: string;
  severity?: string;
  description?: string;
  location?: string;
  siteId?: string;
  incidentDate?: string;
  responseTimeMin?: number;
  resolvedAt?: string;
  casualties?: number;
  injuries?: number;
  fatalities?: number;
  damages?: string;
  status?: string;
}

export class IncidentQueryDto {
  status?: string;
  severity?: string;
  incidentType?: string;
  siteId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
