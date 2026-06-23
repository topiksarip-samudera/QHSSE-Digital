# SELESAI CORE: Template Management (Phase 2 — Core 05)

**Status:** COMPLETE (2026-06-22) | **Tests:** 413 cumulative across 21 test files (+6 template tests)

## Features

### Database (4 tables)
- `templates` — Global/company templates with content, type, versioning, status
- `template_versions` — Immutable version snapshots on publish
- `template_categories` — Categories for organizing templates
- `template_assignments` — Assign templates to company/site/module

### Backend API (`/api/v1/templates`)
- CRUD + publish (version snapshot) + clone
- Categories CRUD + Assignments CRUD
- Global template (companyId=null) editable only by Super Admin
- Published templates immutable (clone to change)

### Frontend (5 pages)
- List (search, type filter, table with scope/status/version)
- Detail (content JSON view, publish/clone buttons, version history)
- Create (name, description, type selector, global toggle)
- Edit (JSON content editor)
- Settings (categories list + add)

### Business Rules
- ✅ Global template editable only by Super Admin
- ✅ Published template immutable
- ✅ Company can clone any template

**Build:** API ✅ | Web ✅ (57 pages) | **Tests:** 413/413 PASS
