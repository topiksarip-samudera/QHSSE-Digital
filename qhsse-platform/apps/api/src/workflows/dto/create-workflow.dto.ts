import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  name!: string;

  @IsString()
  moduleCode!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
