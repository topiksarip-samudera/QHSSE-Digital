# DATABASE MODEL GUIDE

## Core Tables

```text
risk_settings
risk_matrix_definitions
risk_matrix_cells
risk_matrix_versions
risk_severity_levels
risk_likelihood_levels
risk_levels
hazard_categories
hazards
consequence_categories
consequences
hazard_consequence_mappings
risks
risk_assessments
risk_controls
risk_control_effectiveness
risk_actions
risk_reviews
risk_links
hiradc_records
hiradc_activities
hiradc_hazards
hiradc_controls
jsa_records
jsa_steps
jsa_step_hazards
jsa_step_controls
critical_controls
critical_control_verifications
```

## Common Fields

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
project_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
```

## Important Main Fields

### risks

```text
risk_number
risk_title
risk_description
risk_type
risk_category
hazard_id
consequence_id
risk_owner_id
assessment_type
initial_severity_id
initial_likelihood_id
initial_risk_level_id
residual_severity_id
residual_likelihood_id
residual_risk_level_id
control_summary
status
workflow_status
review_frequency
last_review_date
next_review_date
```

### hiradc_records

```text
hiradc_number
title
activity_scope
assessment_date
assessor_id
reviewer_id
approver_id
status
workflow_status
linked_document_id
next_review_date
```

### hiradc_hazards

```text
hiradc_activity_id
hazard_id
hazard_description
consequence_description
existing_control
initial_severity_id
initial_likelihood_id
initial_risk_level_id
additional_control
residual_severity_id
residual_likelihood_id
residual_risk_level_id
pic_id
due_date
status
```

### jsa_records

```text
jsa_number
job_title
job_description
job_location
required_permit
required_ppe
required_tools
assessor_id
reviewer_id
approver_id
status
workflow_status
linked_hiradc_id
next_review_date
```

### jsa_steps

```text
jsa_id
step_number
step_description
sequence_order
```

## Index Wajib

```text
company_id
site_id
department_id
risk_number
hiradc_number
jsa_number
status
workflow_status
initial_risk_level_id
residual_risk_level_id
next_review_date
created_at
```
