# 03 — INCIDENT DATABASE MODEL GUIDE

## Tabel Utama

```text
incidents
incident_classifications
incident_impacts
incident_people
incident_injuries
incident_witnesses
incident_assets
incident_vehicles
incident_property_damages
incident_environmental_impacts
incident_review_records
incident_investigator_assignments
incident_investigations
incident_investigation_team
incident_chronologies
incident_interviews
incident_failed_barriers
incident_investigation_findings
incident_root_causes
incident_5why
incident_fishbone
incident_cause_factors
incident_action_links
incident_capa_effectiveness_reviews
incident_lessons_learned
incident_lessons_learned_acknowledgements
incident_timeline_events
incident_status_histories
```

## Tabel Core yang Dipakai

```text
companies
sites
departments
locations
users
roles
permissions
master_data_groups
master_data_items
workflows
workflow_instances
workflow_histories
actions
attachments
comments
notifications
audit_logs
numbering_rules
webhooks
```

## Field Minimal incidents

```text
id
company_id
site_id
project_id optional
department_id optional
location_id optional
incident_number
title
description
incident_date_time
reported_date_time
reported_by_id
immediate_action
status
workflow_status
current_workflow_step_id optional
actual_severity_id optional
potential_severity_id optional
incident_type_id optional
is_high_severity
is_repeat_incident
investigation_required
closed_at optional
closed_by_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
```

## Index Wajib

```text
company_id
site_id
department_id
location_id
incident_number
status
incident_date_time
reported_by_id
actual_severity_id
potential_severity_id
is_high_severity
created_at
```

## Relasi Wajib

```text
incident belongs to company
incident belongs to site
incident belongs to location
incident has many people
incident has many injuries
incident has many witnesses
incident has one/many investigations
incident has many root causes
incident has many action links
incident has many attachments through file_links
incident has many comments
incident has many audit logs by module/record_id
```

## Soft Delete

Gunakan soft delete untuk:

```text
incidents
incident_people
incident_witnesses
incident_assets
incident_vehicles
incident_attachments links
```

Untuk audit/investigation/RCA, lebih aman gunakan status/archive daripada hard delete.
