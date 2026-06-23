# SELESAI CORE 13: Action Tracking Basic

**Status:** COMPLETE (2026-06-22)
**Tests:** 16 tests passing for action-tracking service, 383 cumulative tests across 17 test files

## Features Implemented

### Database (4 new tables)
- ✅ `action_comments` — Comments on actions (user, content, timestamps, soft delete)
- ✅ `action_evidences` — Links actions to attachment evidence (attachmentId, uploader, description)
- ✅ `action_histories` — Full audit trail (event type, old/new status, notes, metadata)
- ✅ `action_verifications` — Verification records (verified/rejected, verifier, notes, timestamps)
- ✅ All tables indexed, company-scoped, with proper relations to Action, User, Attachment

### Backend API (`/api/v1/actions`)
- ✅ `POST /` — Create action
- ✅ `GET /` — List actions (paginated, filterable by status, priority, assignedTo, sourceType, overdue, search)
- ✅ `GET /:id` — Get action detail (includes comments, evidences, verifications, histories, assignee/creator)
- ✅ `PATCH /:id` — Update action (status transitions, auto-sets completedAt/closedAt)
- ✅ `DELETE /:id` — Soft delete (sets deletedAt, status → cancelled)
- ✅ `POST /:id/comment` — Add comment to action
- ✅ `POST /:id/evidence/:attachmentId` — Link evidence (attachment) to action
- ✅ `DELETE /:id/evidence/:evidenceId` — Remove evidence link
- ✅ `POST /:id/submit-verification` — Submit action for verification
- ✅ `POST /:id/verify` — Verify and close action (creates verification record)
- ✅ `POST /:id/reject` — Reject verification (returns to rejected status)

### Business Rules
- ✅ Action wajib PIC (assignedTo) dan due date
- ✅ Close action dengan verify (verification record created)
- ✅ Verifier tracked separately (bukan PIC disarankan)
- ✅ Overdue computed automatically (dueDate < now)
- ✅ Status transition validation (cannot submit closed, cannot verify non-submitted)
- ✅ Status history tracked on every change
- ✅ Company-scoped isolation

### Permissions
- ✅ `action-tracking-basic.view`
- ✅ `action-tracking-basic.create`
- ✅ `action-tracking-basic.update`
- ✅ `action-tracking-basic.delete`
- ✅ `action-tracking-basic.export`
- ✅ Permissions seeded in `seed.ts`

### Frontend Pages (5 pages)
- ✅ **List Page** (`/dashboard/action-tracking`) — Filters (search, status, priority, overdue checkbox), table with status/priority badges, clickable rows, pagination, "New Action" button
- ✅ **Create Page** (`/dashboard/action-tracking/new`) — Form with title, description, assignee, priority, due date, source type/ID
- ✅ **Detail Page** (`/dashboard/action-tracking/[id]`) — Full info, submit/verify/reject buttons with status-aware visibility, comments section (add/view), evidence list, history timeline
- ✅ **Edit Page** (`/dashboard/action-tracking/[id]/edit`) — Edit all fields including status transitions
- ✅ **Settings Page** (`/dashboard/action-tracking/settings`) — Require evidence toggle, auto-close days, overdue notifications, status flow diagram

### Sidebar Navigation
- ✅ Action Tracking section with sub-links: All Actions, Create, Settings (was dead `href: '#'`)

### API Client
- ✅ Full `actionApi` in `lib/api.ts`: createAction, getActions, getAction, updateAction, deleteAction, addComment, addEvidence, removeEvidence, submitForVerification, verify, rejectVerification

## Cumulative Progress
- **Cores complete:** 13/13 (Core 01-13) — **PHASE 1 COMPLETE**
- **Tests:** 383 total across 17 test files
