# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
audit_programs
audit_program_items
audit_plans
audit_schedules
audits
audit_team_members
audit_scope_items
audit_checklist_executions
inspection_plans
inspection_schedules
inspections
inspection_checklist_executions
checklist_execution_results
checklist_execution_items
findings
finding_root_causes
finding_actions
finding_verifications
audit_reports
inspection_reports
audit_inspection_scores
audit_inspection_settings
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
department_id optional
location_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## audits

```text
id
company_id
audit_number
audit_type_id
audit_title
audit_objective
audit_scope
audit_criteria
site_id
department_id
lead_auditor_id
audit_start_date
audit_end_date
status
workflow_instance_id
checklist_template_id
checklist_version_id
score
rating
created_by
updated_by
created_at
updated_at
deleted_at
```

## inspections

```text
id
company_id
inspection_number
inspection_type_id
inspection_title
site_id
department_id
location_id
inspector_id
inspection_date
schedule_id
checklist_template_id
checklist_version_id
score
rating
status
workflow_instance_id
created_by
updated_by
created_at
updated_at
deleted_at
```

## findings

```text
id
company_id
finding_number
source_type
source_id
source_module
finding_type_id
finding_category_id
severity_id
site_id
department_id
location_id
title
description
requirement_reference
evidence_summary
root_cause_required
action_required
action_id optional
due_date
pic_id
verification_status
status
created_by
updated_by
closed_by
closed_at
created_at
updated_at
deleted_at
```

## checklist_execution_results

```text
id
company_id
source_type
source_id
checklist_template_id
checklist_version_id
executed_by
executed_at
total_score
max_score
percentage_score
rating
status
created_at
updated_at
```

## checklist_execution_items

```text
id
company_id
execution_result_id
section_id
item_id
question_text_snapshot
answer_type_snapshot
answer_value
score
max_score
is_critical
is_failed
comment
evidence_required
finding_created_id optional
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
department_id
status
source_type + source_id
finding_number
audit_number
inspection_number
created_at
due_date
severity_id
```

## Relasi Core

```text
attachments → source_type/source_id
comments → source_type/source_id
audit_logs → module/record_id
workflow_instances → source_type/source_id
actions → source_module/source_id
notifications → event/source_id
```
