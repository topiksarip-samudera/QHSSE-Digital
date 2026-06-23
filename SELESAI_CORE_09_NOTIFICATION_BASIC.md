# SELESAI CORE 09: Notification Basic

**Status**: ✅ COMPLETE  
**Date**: 2026-01-15  
**Phase**: 1 — Core Wajib  
**Test Results**: 34 tests passing (notification.service.spec.ts)  
**Cumulative Tests**: 314 tests across 13 test files — 0 failures

---

## Fitur yang Dibangun

### ✅ In-app Notification
- Create notification with userId, companyId, type, title, message, link
- Channel: `in-app` (default), `email`, `both`
- Mark single notification as read
- Mark all notifications as read
- Delete notification (owner-only)
- Unread count endpoint

### ✅ Email Notification
- NotificationLog tracking per channel (in-app, email)
- Log status lifecycle: `pending` → `sent` / `failed`
- Error message tracking on failure
- Recipient field for email delivery

### ✅ Template Basic
- CRUD for notification templates
- Template fields: code, name, subject, body, type, channel, variables
- Company-scoped templates + global templates (companyId: null)
- Template lookup by code (for programmatic use)
- isActive toggle

### ✅ Read/Unread
- `isRead` boolean field on notifications
- `readAt` timestamp when marked as read
- `GET /api/v1/notifications/unread-count` endpoint
- Filter by `isRead` in notification list

### ✅ Notification Event
- Type-based notifications: info, warning, alert, workflow, action, reminder
- Type filtering in GET endpoint
- Bulk notification creation for multi-user dispatch

### ✅ Reminder Basic
- NotificationPreference model per user/company/module/eventType
- Upsert preference for granular control
- `inAppEnabled` and `emailEnabled` per event type
- Preferences query endpoint

---

## Database Models (Prisma Schema)

| Model | Key Fields | Tenant Scoped |
|---|---|---|
| `Notification` | userId, companyId, type, title, message, channel, isRead, readAt, sentAt | ✅ |
| `NotificationTemplate` | code, name, subject, body, type, channel, isActive, variables | ✅ (nullable) |
| `NotificationLog` | notificationId, channel, status, recipient, errorMessage | ✅ (via notification) |
| `NotificationPreference` | userId, companyId, moduleCode, eventType, inAppEnabled, emailEnabled | ✅ |

---

## API Endpoints

| Method | Endpoint | Permission | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | `notification-basic.view` | List user notifications (paginated, filtered) |
| `GET` | `/api/v1/notifications/unread-count` | `notification-basic.view` | Get unread count |
| `POST` | `/api/v1/notifications` | `notification-basic.create` | Create notification |
| `POST` | `/api/v1/notifications/:id/read` | `notification-basic.view` | Mark as read |
| `POST` | `/api/v1/notifications/read-all` | `notification-basic.view` | Mark all as read |
| `DELETE` | `/api/v1/notifications/:id` | `notification-basic.delete` | Delete notification |
| `GET` | `/api/v1/notifications/templates` | `notification-basic.view` | List templates |
| `POST` | `/api/v1/notifications/templates` | `notification-basic.create` | Create template |
| `GET` | `/api/v1/notifications/templates/:id` | `notification-basic.view` | Get template by ID |
| `PATCH` | `/api/v1/notifications/templates/:id` | `notification-basic.update` | Update template |
| `DELETE` | `/api/v1/notifications/templates/:id` | `notification-basic.delete` | Delete template |
| `GET` | `/api/v1/notifications/preferences` | `notification-basic.view` | Get user preferences |
| `PUT` | `/api/v1/notifications/preferences` | `notification-basic.update` | Upsert preference |
| `GET` | `/api/v1/notifications/logs/:notificationId` | `notification-basic.view` | Get delivery logs |

---

## Backend Implementation

### Files
| File | Description |
|---|---|
| `apps/api/src/notifications/notification.service.ts` | Service with 18 methods |
| `apps/api/src/notifications/notification.controller.ts` | Controller with REST endpoints |
| `apps/api/src/notifications/notification.module.ts` | NestJS module |
| `apps/api/src/notifications/dto/create-notification.dto.ts` | DTOs with validation |
| `apps/api/src/notifications/__tests__/notification.service.spec.ts` | 34 unit tests |

### Service Methods
- `createNotification` — Create single notification
- `getNotifications` — Paginated list with filters (type, isRead)
- `getUnreadCount` — Count unread for user
- `markAsRead` — Mark single as read (owner check)
- `markAllAsRead` — Mark all as read for user
- `deleteNotification` — Delete with owner check
- `createTemplate` — Create notification template
- `getTemplates` — List templates (company + global)
- `getTemplateById` — Get template by ID
- `getTemplateByCode` — Get template by code
- `updateTemplate` — Update template
- `deleteTemplate` — Delete template
- `getPreferences` — Get user preferences
- `upsertPreference` — Upsert preference
- `getLogs` — Get delivery logs
- `createLog` — Create log entry
- `updateLogStatus` — Update log status
- `sendBulkNotification` — Bulk create notifications

---

## Frontend Implementation

### Pages
| Page | Route | Description |
|---|---|---|
| Notifications List | `/dashboard/notifications` | List with filter by type, read/unread toggle |
| Templates | `/dashboard/notifications/templates` | Template CRUD management |
| Settings | `/dashboard/notifications/settings` | User notification preferences |

### Sidebar Navigation
```
🔔 Notifications
  ├── All Notifications → /dashboard/notifications
  ├── Templates → /dashboard/notifications/templates
  └── Settings → /dashboard/notifications/settings
```

### API Client (`apps/web/src/lib/api.ts`)
- `notificationApi` object with 12 methods
- TypeScript interfaces: NotificationData, NotificationTemplateData, NotificationPreferenceData, NotificationLogData, NotificationQuery

---

## Test Suite Summary

| Test Group | Count |
|---|---|
| createNotification | 2 |
| getNotifications | 4 |
| getUnreadCount | 2 |
| markAsRead | 3 |
| markAllAsRead | 1 |
| deleteNotification | 3 |
| createTemplate | 1 |
| getTemplates | 2 |
| getTemplateById | 2 |
| getTemplateByCode | 2 |
| updateTemplate | 2 |
| deleteTemplate | 2 |
| getPreferences | 1 |
| upsertPreference | 1 |
| getLogs | 1 |
| createLog | 1 |
| updateLogStatus | 2 |
| sendBulkNotification | 2 |
| **TOTAL** | **34** |

---

## Business Rules Implemented

- ✅ Notification creation with channel support (in-app, email, both)
- ✅ Owner-only read/delete enforcement
- ✅ Template editable with company/global scope
- ✅ Delivery log tracking per channel
- ✅ Bulk notification for multi-user dispatch
- ✅ Preference-based notification control per module/event

---

## Validation & Security

- ✅ Owner check on markAsRead and deleteNotification
- ✅ ForbiddenException for non-owner access
- ✅ NotFoundException for missing resources
- ✅ Company-scoped queries with tenant isolation
- ✅ Permission guards on all endpoints (`notification-basic.*`)
- ✅ Global templates accessible across companies

---

## Cumulative Progress

| Core | Tests | Status |
|---|---|---|
| 01 — Multi-Company Tenant | 20 | ✅ |
| 02 — Organization Structure | 47 | ✅ |
| 03 — User Management | 37 | ✅ |
| 04 — Authentication | 30 | ✅ |
| 05 — Role & Permission | 26 | ✅ |
| 06 — Master Data | 31 | ✅ |
| 07 — Module Management | 39 | ✅ |
| 08 — Workflow Engine | 44 | ✅ |
| **09 — Notification Basic** | **34** | **✅** |
| **TOTAL** | **308** | **9/13 cores** |

---

**SELESAI CORE: Notification Basic** ✅
