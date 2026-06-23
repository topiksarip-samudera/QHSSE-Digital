import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateWorkflowStepDto {
  @IsString()
  name!: string;

  @IsInt()
  stepOrder!: number;

  @IsString()
  assigneeType!: string; // role, user, department_head

  @IsString()
  assigneeValue!: string; // role code, user id, etc

  @IsString()
  actionType!: string; // approve, reject, review

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsInt()
  slaHours?: number;

  @IsOptional()
  @IsInt()
  escalateAfterHr?: number;
}

export class UpdateWorkflowStepDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  stepOrder?: number;

  @IsOptional()
  @IsString()
  assigneeType?: string;

  @IsOptional()
  @IsString()
  assigneeValue?: string;

  @IsOptional()
  @IsString()
  actionType?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsInt()
  slaHours?: number;
}
