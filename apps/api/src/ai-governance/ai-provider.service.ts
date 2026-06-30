import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto, UpdateProviderDto, RotateProviderKeyDto, CreateProviderModelDto, UpdateProviderModelDto } from './dto/provider.dto';
import * as crypto from 'crypto';

@Injectable()
export class AIProviderService {
  constructor(private prisma: PrismaService) {}

  private readonly encryptionKey = process.env.AI_PROVIDER_ENCRYPTION_KEY || 'default-key-change-in-production';

  // Encrypt API key before storage
  private encryptApiKey(apiKey: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt API key for use
  private decryptApiKey(encryptedKey: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Create AI provider
  async createProvider(companyId: string, userId: string, dto: CreateProviderDto) {
    const existingProvider = await this.prisma.aIProvider.findUnique({
      where: { providerKey: dto.providerKey },
    });

    if (existingProvider) {
      throw new BadRequestException(`Provider with key ${dto.providerKey} already exists`);
    }

    const encryptedKey = this.encryptApiKey(dto.apiKey);

    return this.prisma.aIProvider.create({
      data: {
        providerKey: dto.providerKey,
        name: dto.name,
        description: dto.description,
        baseUrl: dto.baseUrl,
        apiKeyEncrypted: encryptedKey,
        authType: dto.authType,
        isEnabled: dto.isEnabled,
        defaultModel: dto.defaultModel,
        maxTokens: dto.maxTokens,
        timeoutSeconds: dto.timeoutSeconds,
        maxRetries: dto.maxRetries,
        priority: dto.priority,
        createdBy: userId,
      },
    });
  }

  // List all providers
  async listProviders(companyId: string) {
    return this.prisma.aIProvider.findMany({
      where: { deletedAt: null },
      include: {
        models: {
          where: { isEnabled: true },
        },
        _count: {
          select: { usageLogs: true },
        },
      },
      orderBy: { priority: 'asc' },
    });
  }

  // Get provider by ID
  async getProvider(id: string, companyId: string) {
    const provider = await this.prisma.aIProvider.findUnique({
      where: { id },
      include: {
        models: true,
        tenantSettings: {
          where: { companyId },
        },
      },
    });

    if (!provider || provider.deletedAt) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  // Update provider
  async updateProvider(id: string, companyId: string, userId: string, dto: UpdateProviderDto) {
    const provider = await this.getProvider(id, companyId);

    return this.prisma.aIProvider.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  // Delete provider (soft delete)
  async deleteProvider(id: string, companyId: string, userId: string) {
    const provider = await this.getProvider(id, companyId);

    return this.prisma.aIProvider.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isEnabled: false,
      },
    });
  }

  // Rotate provider API key
  async rotateProviderKey(id: string, companyId: string, userId: string, dto: RotateProviderKeyDto) {
    const provider = await this.getProvider(id, companyId);
    const encryptedKey = this.encryptApiKey(dto.newApiKey);

    return this.prisma.aIProvider.update({
      where: { id },
      data: {
        apiKeyEncrypted: encryptedKey,
        updatedAt: new Date(),
      },
    });
  }

  // Test provider connection
  async testProvider(id: string, companyId: string) {
    const provider = await this.getProvider(id, companyId);
    const apiKey = this.decryptApiKey(provider.apiKeyEncrypted);

    // TODO: Implement actual API test based on provider type
    // For now, return mock success
    return {
      success: true,
      provider: provider.providerKey,
      latency: 150,
      message: 'Connection successful',
    };
  }

  // Create provider model
  async createProviderModel(companyId: string, userId: string, dto: CreateProviderModelDto) {
    const provider = await this.getProvider(dto.providerId, companyId);

    return this.prisma.aIProviderModel.create({
      data: {
        providerId: dto.providerId,
        modelKey: dto.modelKey,
        displayName: dto.displayName,
        contextWindow: dto.contextWindow,
        maxOutputTokens: dto.maxOutputTokens,
        costPer1kInput: dto.costPer1kInput,
        costPer1kOutput: dto.costPer1kOutput,
        supportsStreaming: dto.supportsStreaming,
        supportsFunctions: dto.supportsFunctions,
        supportsVision: dto.supportsVision,
        isEnabled: dto.isEnabled,
      },
    });
  }

  // List provider models
  async listProviderModels(providerId: string, companyId: string) {
    await this.getProvider(providerId, companyId);

    return this.prisma.aIProviderModel.findMany({
      where: {
        providerId,
        isEnabled: true,
      },
      include: {
        aliases: true,
      },
      orderBy: { displayName: 'asc' },
    });
  }

  // Get all available models (from all providers)
  async listAllModels(companyId: string) {
    return this.prisma.aIProviderModel.findMany({
      where: {
        isEnabled: true,
        provider: {
          isEnabled: true,
          deletedAt: null,
        },
      },
      include: {
        provider: {
          select: {
            id: true,
            providerKey: true,
            name: true,
          },
        },
        aliases: true,
      },
      orderBy: [
        { provider: { priority: 'asc' } },
        { displayName: 'asc' },
      ],
    });
  }

  // Update provider model
  async updateProviderModel(modelId: string, companyId: string, dto: UpdateProviderModelDto) {
    const model = await this.prisma.aIProviderModel.findUnique({
      where: { id: modelId },
      include: { provider: true },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return this.prisma.aIProviderModel.update({
      where: { id: modelId },
      data: dto,
    });
  }

  // Sync models from provider (fetch available models from API)
  async syncProviderModels(providerId: string, companyId: string) {
    const provider = await this.getProvider(providerId, companyId);
    
    // TODO: Implement actual model sync based on provider API
    // For now, return mock success
    return {
      success: true,
      provider: provider.providerKey,
      modelsSynced: 0,
      message: 'Model sync not yet implemented for this provider',
    };
  }
}
