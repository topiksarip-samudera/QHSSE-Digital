import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum DocumentSourceType {
  UPLOAD = 'upload',
  URL = 'url',
  MODULE_SYNC = 'module_sync',
}

export enum KnowledgeBaseStatus {
  ACTIVE = 'active',
  INDEXING = 'indexing',
  FAILED = 'failed',
}

export class CreateKnowledgeBaseDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsEnum(['user', 'team', 'company'])
  @IsOptional()
  visibility?: string = 'company';

  @IsString()
  @IsOptional()
  embeddingModel?: string = 'text-embedding-ada-002';

  @IsInt()
  @Min(100)
  @Max(4000)
  @IsOptional()
  chunkSize?: number = 1000;

  @IsInt()
  @Min(0)
  @Max(1000)
  @IsOptional()
  chunkOverlap?: number = 200;
}

export class UpdateKnowledgeBaseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(100)
  @Max(4000)
  @IsOptional()
  chunkSize?: number;

  @IsInt()
  @Min(0)
  @Max(1000)
  @IsOptional()
  chunkOverlap?: number;

  @IsEnum(KnowledgeBaseStatus)
  @IsOptional()
  status?: KnowledgeBaseStatus;
}

export class UploadDocumentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsString()
  @IsOptional()
  recordId?: string;
}

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isIndexed?: boolean;
}

export class IndexDocumentDto {
  @IsBoolean()
  @IsOptional()
  forceReindex?: boolean = false;
}

export class SearchRagDto {
  @IsString()
  query: string;

  @IsString()
  @IsOptional()
  knowledgeBaseId?: string;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  topK?: number = 5;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  minScore?: number = 0.7;

  @IsString()
  @IsOptional()
  moduleKey?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  filters?: string[];
}

export class RetrieveContextDto {
  @IsString()
  conversationId: string;

  @IsString()
  query: string;

  @IsEnum(['rag_search', 'module_query', 'combined'])
  requestType: string;

  @IsBoolean()
  @IsOptional()
  enableRag?: boolean = true;

  @IsBoolean()
  @IsOptional()
  enableModuleData?: boolean = true;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  topK?: number = 5;
}

export class ListKnowledgeBasesQueryDto {
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
  moduleKey?: string;

  @IsEnum(KnowledgeBaseStatus)
  @IsOptional()
  status?: KnowledgeBaseStatus;

  @IsString()
  @IsOptional()
  search?: string;
}

export class ListDocumentsQueryDto {
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
  knowledgeBaseId: string;

  @IsBoolean()
  @IsOptional()
  isIndexed?: boolean;

  @IsEnum(DocumentSourceType)
  @IsOptional()
  sourceType?: DocumentSourceType;

  @IsString()
  @IsOptional()
  search?: string;
}
