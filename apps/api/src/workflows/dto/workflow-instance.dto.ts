import { IsString, IsOptional } from 'class-validator';

export class CreateWorkflowInstanceDto {
  @IsString()
  workflowId!: string;

  @IsString()
  recordType!: string;

  @IsString()
  recordId!: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class WorkflowActionDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

export class WorkflowQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  moduleCode?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
