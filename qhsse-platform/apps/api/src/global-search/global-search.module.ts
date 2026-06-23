import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [GlobalSearchController], providers: [GlobalSearchService], exports: [GlobalSearchService] })
export class GlobalSearchModule {}
