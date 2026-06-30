import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// ─── Training Matrix ────────────────────────────────────────────────────────

export class CreateTrainingMatrixDto {
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirement?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyTarget?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() validUntil?: string;
}

export class UpdateTrainingMatrixDto {
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirement?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyTarget?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() validUntil?: string;
}

// ─── Training Plan ──────────────────────────────────────────────────────────

export class CreateTrainingPlanDto {
  @ApiPropertyOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() typeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() venue?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxParticipants?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class UpdateTrainingPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() typeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() venue?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxParticipants?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

// ─── Training Session ───────────────────────────────────────────────────────

export class CreateTrainingSessionDto {
  @ApiPropertyOptional() @IsString() planId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() actualDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() venue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateTrainingSessionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() venue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── Training Attendance ────────────────────────────────────────────────────

export class CreateTrainingAttendanceDto {
  @ApiPropertyOptional() @IsString() sessionId?: string;
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() certificateIssued?: boolean;
}

export class UpdateTrainingAttendanceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() certificateIssued?: boolean;
}

// ─── Competency Matrix ──────────────────────────────────────────────────────

export class CreateCompetencyMatrixDto {
  @ApiPropertyOptional() @IsString() positionId?: string;
  @ApiPropertyOptional() @IsString() competencyItem?: string;
  @ApiPropertyOptional() @IsString() requiredLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assessmentMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revalidationPeriod?: string;
}

export class UpdateCompetencyMatrixDto {
  @ApiPropertyOptional() @IsOptional() @IsString() positionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyItem?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requiredLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assessmentMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revalidationPeriod?: string;
}

// ─── Competency Assessment ──────────────────────────────────────────────────

export class CreateCompetencyAssessmentDto {
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsString() competencyItemId?: string;
  @ApiPropertyOptional() @IsString() assessorId?: string;
  @ApiPropertyOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() assessedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() evidence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateCompetencyAssessmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── Training Need Record ───────────────────────────────────────────────────

export class CreateTrainingNeedDto {
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trainingTypeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyGap?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class UpdateTrainingNeedDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trainingTypeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyGap?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

// ─── Induction Record ───────────────────────────────────────────────────────

export class CreateInductionDto {
  @ApiPropertyOptional() @IsString() inductionType?: string;
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsString() conductedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateInductionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() inductionType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conductedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── Toolbox Meeting ────────────────────────────────────────────────────────

export class CreateToolboxMeetingDto {
  @ApiPropertyOptional() @IsString() topic?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() attendeesCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateToolboxMeetingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() topic?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facilitator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() attendeesCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── Toolbox Attendance ─────────────────────────────────────────────────────

export class CreateToolboxAttendanceDto {
  @ApiPropertyOptional() @IsString() meetingId?: string;
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() signature?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

// ─── Certificate Record ─────────────────────────────────────────────────────

export class CreateCertificateDto {
  @ApiPropertyOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trainingId?: string;
  @ApiPropertyOptional() @IsString() certificateType?: string;
  @ApiPropertyOptional() @IsString() issuedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() issuedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificateNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateCertificateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() certificateType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issuedBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificateNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class RenewCertificateDto {
  @ApiPropertyOptional() @IsDateString() issuedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
}

// ─── Training Link ──────────────────────────────────────────────────────────

export class CreateTrainingLinkDto {
  @ApiPropertyOptional() @IsString() trainingId?: string;
  @ApiPropertyOptional() @IsString() linkedModule?: string;
  @ApiPropertyOptional() @IsString() linkedRecordId?: string;
  @ApiPropertyOptional() @IsString() linkedRecordType?: string;
}
