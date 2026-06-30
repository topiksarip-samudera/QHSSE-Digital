import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';

export enum ProviderKey {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  AZURE = 'azure',
  LOCAL = 'local',
}

export enum AuthType {
  BEARER = 'bearer',
  API_KEY = 'api_key',
  OAUTH = 'oauth',
}

export class CreateProviderDto {
  @IsEnum(ProviderKey)
  providerKey: ProviderKey;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  baseUrl: string;

  @IsString()
  apiKey: string; // Will be encrypted before storage

  @IsEnum(AuthType)
  @IsOptional()
  authType?: AuthType = AuthType.BEARER;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;

  @IsString()
  @IsOptional()
  defaultModel?: string;

  @IsInt()
  @Min(1000)
  @Max(100000)
  @IsOptional()
  maxTokens?: number = 8000;

  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  timeoutSeconds?: number = 60;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number = 3;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  priority?: number = 10;
}

export class UpdateProviderDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  baseUrl?: string;

  @IsEnum(AuthType)
  @IsOptional()
  authType?: AuthType;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  defaultModel?: string;

  @IsInt()
  @Min(1000)
  @Max(100000)
  @IsOptional()
  maxTokens?: number;

  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  timeoutSeconds?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  priority?: number;
}

export class RotateProviderKeyDto {
  @IsString()
  newApiKey: string;
}

export class CreateProviderModelDto {
  @IsString()
  providerId: string;

  @IsString()
  modelKey: string;

  @IsString()
  displayName: string;

  @IsInt()
  @Min(1000)
  @Max(1000000)
  contextWindow: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  maxOutputTokens: number;

  @IsInt()
  @Min(0)
  costPer1kInput: number;

  @IsInt()
  @Min(0)
  costPer1kOutput: number;

  @IsBoolean()
  @IsOptional()
  supportsStreaming?: boolean = true;

  @IsBoolean()
  @IsOptional()
  supportsFunctions?: boolean = false;

  @IsBoolean()
  @IsOptional()
  supportsVision?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean = true;
}

export class UpdateProviderModelDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsInt()
  @Min(1000)
  @Max(1000000)
  @IsOptional()
  contextWindow?: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  @IsOptional()
  maxOutputTokens?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  costPer1kInput?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  costPer1kOutput?: number;

  @IsBoolean()
  @IsOptional()
  supportsStreaming?: boolean;

  @IsBoolean()
  @IsOptional()
  supportsFunctions?: boolean;

  @IsBoolean()
  @IsOptional()
  supportsVision?: boolean;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
