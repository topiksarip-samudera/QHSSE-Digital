# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
permit_types
permit_type_requirements
permit_settings
permits
permit_work_locations
permit_work_parties
permit_workers
permit_contractors
permit_risk_links
permit_jsa_links
permit_ppe_requirements
permit_tool_requirements
permit_equipment_requirements
permit_asset_links
permit_competency_checks
permit_certificate_checks
permit_gas_tests
permit_hot_work_controls
permit_confined_space_controls
permit_loto_plans
permit_loto_points
permit_loto_locks
permit_isolation_points
permit_simops_checks
permit_clash_records
permit_extensions
permit_suspensions
permit_closeouts
permit_handover_records
permit_qr_verifications
permit_reports
permit_active_board_snapshots
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

## permits

```text
id
company_id
permit_number
permit_type_id
title
job_description
work_scope
site_id
project_id
department_id
location_id
area_id optional
contractor_id optional
requestor_id
area_owner_id optional
hse_reviewer_id optional
permit_issuer_id optional
start_datetime
end_datetime
actual_start_datetime optional
actual_end_datetime optional
risk_level
jsa_required
jsa_status
gas_test_required
loto_required
simops_required
competency_check_status
equipment_check_status
gas_test_status
loto_status
simops_status
workflow_instance_id
status
created_by
updated_by
created_at
updated_at
deleted_at
```

## permit_types

```text
id
company_id optional
code
name
description
default_validity_hours
jsa_required
gas_test_required
loto_required
simops_required
competency_required
equipment_certificate_required
fire_watch_required
standby_man_required
rescue_plan_required
is_active
created_at
updated_at
```

## permit_type_requirements

```text
id
company_id
permit_type_id
requirement_type
requirement_key
requirement_name
is_mandatory
validation_mode
display_order
config_json
created_at
updated_at
```

`validation_mode`:

```text
block
warning
info
```

## permit_workers

```text
id
company_id
permit_id
worker_id optional
contractor_worker_id optional
name_snapshot
company_snapshot
role_in_work
is_supervisor
competency_check_status
certificate_check_status
medical_check_status optional
created_at
updated_at
```

## permit_gas_tests

```text
id
company_id
permit_id
test_datetime
tested_by
oxygen_percent
lel_percent
h2s_ppm
co_ppm
other_gas_json
result
remarks
next_test_due
attachment_id optional
created_at
updated_at
```

## permit_loto_points

```text
id
company_id
permit_id
asset_id optional
isolation_point_code
energy_type
isolation_method
lock_number
tag_number
applied_by
verified_by
applied_at
removed_by optional
removed_at optional
status
created_at
updated_at
```

## permit_simops_checks

```text
id
company_id
permit_id
work_location_id
start_datetime
end_datetime
conflict_status
conflict_summary
control_measures
approved_by optional
created_at
updated_at
```

## permit_closeouts

```text
id
company_id
permit_id
work_completed
area_cleaned
tools_removed
loto_removed
waste_removed
fire_watch_completed optional
handover_to
closeout_notes
submitted_by
verified_by optional
submitted_at
verified_at optional
status
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
permit_number
permit_type_id
status
start_datetime
end_datetime
location_id
contractor_id
requestor_id
area_owner_id
permit_issuer_id
```
