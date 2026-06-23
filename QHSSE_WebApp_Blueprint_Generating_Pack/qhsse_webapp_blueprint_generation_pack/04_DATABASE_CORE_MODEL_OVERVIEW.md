# 04 — DATABASE CORE MODEL OVERVIEW

## Prinsip

Semua tabel tenant-specific wajib memiliki `company_id`. Tabel global seperti `plans`, `modules`, dan `permissions` boleh tanpa company_id jika berlaku global.

## Core Tables

```text
tenants
companies
company_settings
business_units
sites
projects
departments
sections
locations
positions
users
user_profiles
user_company_assignments
user_site_assignments
user_department_assignments
roles
permissions
role_permissions
user_roles
user_scopes
modules
module_features
tenant_modules
tenant_feature_flags
master_data_groups
master_data_items
workflows
workflow_steps
workflow_instances
workflow_histories
actions
notifications
attachments
files
audit_logs
```

## Index Wajib

```text
company_id
site_id
created_by
status
deleted_at
code
email
module_name
record_id
created_at
```

## Soft Delete

Gunakan soft delete untuk:

```text
companies
sites
departments
locations
users
roles custom
master_data_items
workflows
actions
attachments
business records
```

## Audit Fields

Untuk record penting:

```text
created_by
updated_by
deleted_by
created_at
updated_at
deleted_at
```

## Status Pattern

Gunakan enum status yang jelas:

```text
active
inactive
draft
submitted
in_review
approved
rejected
closed
cancelled
archived
suspended
```
