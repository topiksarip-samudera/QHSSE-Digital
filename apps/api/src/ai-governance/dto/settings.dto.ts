import { IsString, IsBoolean, IsInt, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';

export class UpdateAISettingsDto {
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  defaultProviderId?: string;

  @IsString()
  @IsOptional()
  defaultModel?: string;

  @IsInt()
  @Min(100)
  @Max(100000)
  @IsOptional()
  maxTokensPerRequest?: number;

  @IsInt()
  @Min(1000)
  @Max(10000000)
  @IsOptional()
  maxTokensPerDay?: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  maxCostPerDay?: number;

  @IsBoolean()
  @IsOptional()
  enableRag?: boolean;

  @IsBoolean()
  @IsOptional()
  enableModuleConnectors?: boolean;

  @IsBoolean()
  @IsOptional()
  enableGuardrails?: boolean;

  @IsBoolean()
  @IsOptional()
  enableAuditLog?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedModules?: string[];
}

export class CreateFeatureToggleDto {
  @IsString()
  featureKey: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;

  @IsOptional()
  config?: any;
}

export class UpdateFeatureToggleDto {
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsOptional()
  config?: any;
}

export class CreateGuardrailPolicyDto {
  @IsString()
  policyKey: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;

  @IsString()
  @IsOptional()
  severity?: string = 'high'; // low, medium, high, critical

  @IsString()
  @IsOptional()
  action?: string = 'block'; // log, warn, block

  @IsOptional()
  rules?: any;
}

export class UpdateGuardrailPolicyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsOptional()
  rules?: any;
}

export class CreateRateLimitDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  featureKey?: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxRequestsPerMinute?: number;

  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  maxRequestsPerHour?: number;

  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  maxRequestsPerDay?: number;

  @IsInt()
  @Min(1000)
  @Max(10000000)
  @IsOptional()
  maxTokensPerDay?: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  maxCostPerDay?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;
}

export class UpdateRateLimitDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxRequestsPerMinute?: number;

  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  maxRequestsPerHour?: number;

  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  maxRequestsPerDay?: number;

  @IsInt()
  @Min(1000)
  @Max(10000000)
  @IsOptional()
  maxTokensPerDay?: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  maxCostPerDay?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

export class UpdateAdminControlDto {
  @IsBoolean()
  @IsOptional()
  allowUserPrompts?: boolean;

  @IsBoolean()
  @IsOptional()
  allowDocumentUpload?: boolean;

  @IsBoolean()
  @IsOptional()
  allowModuleData?: boolean;

  @IsBoolean()
  @IsOptional()
  allowExport?: boolean;

  @IsBoolean()
  @IsOptional()
  requireApproval?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blockedKeywords?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedDomains?: string[];

  @IsOptional()
  config?: any;
}
