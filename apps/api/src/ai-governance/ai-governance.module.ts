import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Legacy controllers and services
import { AiGovernanceService } from './ai-governance.service';
import { AiGovernanceController } from './ai-governance.controller';
import { AiChatController } from './chat.controller';
import { AiChatService } from './chat.service';
import { AiSkillsController } from './skills.controller';

// New AI Assistant services
import { AIProviderService } from './ai-provider.service';
import { AIConversationService } from './ai-conversation.service';
import { AIKnowledgeBaseService } from './ai-knowledge-base.service';
import { AISkillService } from './ai-skill.service';
import { AIUsageService } from './ai-usage.service';
import { AISettingsService } from './ai-settings.service';

// New AI Assistant controllers
import { AIProviderController } from './ai-provider.controller';
import { AIConversationController } from './ai-conversation.controller';
import { AIKnowledgeBaseController } from './ai-knowledge-base.controller';
import { AISkillController } from './ai-skill.controller';
import { AIUsageController } from './ai-usage.controller';
import { AISettingsController } from './ai-settings.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    // Legacy controllers
    AiGovernanceController,
    AiChatController,
    AiSkillsController,
    // New AI Assistant controllers
    AIProviderController,
    AIConversationController,
    AIKnowledgeBaseController,
    AISkillController,
    AIUsageController,
    AISettingsController,
  ],
  providers: [
    // Legacy services
    AiGovernanceService,
    AiChatService,
    // New AI Assistant services
    AIProviderService,
    AIConversationService,
    AIKnowledgeBaseService,
    AISkillService,
    AIUsageService,
    AISettingsService,
  ],
  exports: [
    // Legacy exports
    AiGovernanceService,
    AiChatService,
    // New AI Assistant services
    AIProviderService,
    AIConversationService,
    AIKnowledgeBaseService,
    AISkillService,
    AIUsageService,
    AISettingsService,
  ],
})
export class AiGovernanceModule {}
