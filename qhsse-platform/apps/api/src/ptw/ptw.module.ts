import { Module } from '@nestjs/common';
import { PtwService } from './ptw.service';
import { PtwController } from './ptw.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [PtwController], providers: [PtwService], exports: [PtwService] })
export class PtwModule {}
