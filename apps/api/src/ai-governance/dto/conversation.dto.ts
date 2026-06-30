import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ConversationMode {
  CHAT = 'chat',
  ASSISTANT = 'assistant',
  RAG = 'rag',
  MODULE_CONTEXT = 'module_context',
}

export enum ConversationVisibility {
  PRIVATE = 'private',
  SHARED = 'shared',
  TEAM = 'team',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  FUNCTION = 'function',
}

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ConversationVisibility)
  @IsOptional()
  visibility?: ConversationVisibility = ConversationVisibility.PRIVATE;
}

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ConversationVisibility)
  @IsOptional()
  visibility?: ConversationVisibility;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  title: string;

  @IsEnum(ConversationMode)
  @IsOptional()
  mode?: ConversationMode = ConversationMode.CHAT;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsString()
  @IsOptional()
  sourceRecordId?: string;

  @IsEnum(ConversationVisibility)
  @IsOptional()
  visibility?: ConversationVisibility = ConversationVisibility.PRIVATE;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number = 0.7;

  @IsInt()
  @Min(100)
  @Max(32000)
  @IsOptional()
  maxTokens?: number = 2000;

  @IsBoolean()
  @IsOptional()
  enableRag?: boolean = false;

  @IsBoolean()
  @IsOptional()
  enableModuleData?: boolean = false;
}

export class UpdateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsInt()
  @Min(100)
  @Max(32000)
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  enableRag?: boolean;

  @IsBoolean()
  @IsOptional()
  enableModuleData?: boolean;

  @IsEnum(ConversationStatus)
  @IsOptional()
  status?: ConversationStatus;
}

export class SendMessageDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsInt()
  @Min(100)
  @Max(32000)
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  stream?: boolean = false;
}

export class MessageSourceDto {
  @IsEnum(['document', 'module_data', 'web_search'])
  sourceType: string;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsString()
  @IsOptional()
  recordId?: string;

  @IsString()
  @IsOptional()
  documentId?: string;

  @IsString()
  @IsOptional()
  chunkId?: string;

  @IsString()
  @IsOptional()
  sourceTitle?: string;

  @IsString()
  @IsOptional()
  sourceExcerpt?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  confidenceScore?: number;
}

export class ExportConversationDto {
  @IsEnum(['json', 'markdown', 'pdf', 'txt'])
  format: string;

  @IsBoolean()
  @IsOptional()
  includeSources?: boolean = true;

  @IsBoolean()
  @IsOptional()
  includeMetadata?: boolean = false;
}

export class ListConversationsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsEnum(ConversationMode)
  @IsOptional()
  mode?: ConversationMode;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsEnum(ConversationStatus)
  @IsOptional()
  status?: ConversationStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
