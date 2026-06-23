# SELESAI CORE: Form Builder (Phase 2 — Core 01)

**Status:** COMPLETE (2026-06-22)
**Tests:** 10 tests passing for form-builder service, 393 cumulative tests across 18 test files

## Features Implemented

### Database (8 tables)
- ✅ `forms` — Form definitions (name, description, status, version)
- ✅ `form_versions` — Immutable version snapshots with full definition JSON
- ✅ `form_sections` — Sections within forms (title, sort order)
- ✅ `form_fields` — Fields: text, number, textarea, select, radio, checkbox, date, file, email, phone; required, placeholder, help text, repeatable, validation rules, formula
- ✅ `form_field_options` — Options for select/radio/checkbox fields
- ✅ `form_conditions` — Conditional logic: show/hide/require/set_value with operators
- ✅ `form_submissions` — Submitted form data (links to version, submitter)
- ✅ `form_submission_values` — Individual field values per submission

### Backend API (`/api/v1/forms`)
- ✅ `POST /` — Create form with sections, fields, options, conditions
- ✅ `GET /` — List forms (paginated, filterable by status, search)
- ✅ `GET /:id` — Get form detail with full tree (sections → fields → options → conditions)
- ✅ `PATCH /:id` — Update form (draft only; published forms are immutable)
- ✅ `DELETE /:id` — Soft delete
- ✅ `POST /:id/publish` — Publish form (creates version snapshot, sets status → active)
- ✅ `POST /:id/clone` — Clone form with all sections/fields
- ✅ `POST /submissions` — Submit form data with field values
- ✅ `GET /:id/submissions` — List submissions for a form
- ✅ `GET /submissions/:submissionId` — Get submission detail

### Business Rules
- ✅ Published form immutable; change via clone + new version
- ✅ Submission stores form version ID
- ✅ Backend validates required fields
- ✅ Company-scoped isolation

### Permissions
- ✅ `form-builder.view`, `form-builder.create`, `form-builder.update`, `form-builder.delete`, `form-builder.export`
- ✅ Permissions seeded in `seed.ts`

### Frontend Pages (5 pages)
- ✅ **List Page** (`/dashboard/form-builder`) — Search, status filter, table with name/status/version/sections/submissions, pagination
- ✅ **Create Page** (`/dashboard/form-builder/new`) — Name and description form
- ✅ **Detail Page** (`/dashboard/form-builder/[id]`) — Sections/fields tree, publish/clone/delete actions, version history
- ✅ **Edit Page** (`/dashboard/form-builder/[id]/edit`) — Full form editor: add/remove sections and fields, field type selector, required toggle, key input
- ✅ **Settings Page** (`/dashboard/form-builder/settings`) — Require publish toggle, max fields slider, field type list

### Sidebar Navigation
- ✅ Form Builder section: All Forms, Create Form, Settings

### API Client
- ✅ `formApi` in `lib/api.ts`: createForm, getForms, getForm, updateForm, deleteForm, publishForm, cloneForm, submitForm, getSubmissions, getSubmissionDetail

## Cumulative Progress
- **Phase 1:** 13/13 complete
- **Phase 2:** 1/12 complete
- **Tests:** 393 total across 18 test files
