export class CreateContactDto {
  name: string;
  title?: string;
  organization?: string;
  contactType: string;
  phone?: string;
  mobile?: string;
  email?: string;
  isPrimary?: boolean;
  siteId?: string;
  priority?: number;
}

export class UpdateContactDto {
  name?: string;
  title?: string;
  organization?: string;
  contactType?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  isPrimary?: boolean;
  siteId?: string;
  priority?: number;
  status?: string;
}

export class ContactQueryDto {
  status?: string;
  contactType?: string;
  siteId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
