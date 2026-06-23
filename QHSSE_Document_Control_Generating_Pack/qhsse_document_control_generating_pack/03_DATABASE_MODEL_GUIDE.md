# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
document_types
document_categories
document_settings
documents
document_metadata
document_revisions
document_files
document_reviewers
document_approvers
document_distribution_groups
document_distributions
document_acknowledgements
document_controlled_copies
document_obsolete_records
document_archive_records
document_retention_rules
document_qr_codes
document_access_logs
document_download_logs
document_links
document_reports
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## documents

```text
id
company_id
document_number
title
document_type_id
document_category_id
owner_department_id
applicable_site_id optional
applicable_department_id optional
confidentiality_level
current_revision_id optional
latest_published_revision_id optional
status
review_frequency_months
next_review_date
effective_date optional
expiry_date optional
workflow_instance_id optional
created_by
updated_by
created_at
updated_at
deleted_at
```

## document_revisions

```text
id
company_id
document_id
revision_number
revision_label
revision_date
change_summary
reason_for_change
file_id
prepared_by
reviewed_by optional
approved_by optional
published_by optional
effective_date optional
published_at optional
superseded_at optional
status
workflow_instance_id optional
created_at
updated_at
```

## document_distributions

```text
id
company_id
document_id
revision_id
distribution_type
recipient_user_id optional
recipient_role_id optional
recipient_site_id optional
recipient_department_id optional
distributed_by
distributed_at
acknowledgement_required
due_date optional
status
created_at
updated_at
```

## document_acknowledgements

```text
id
company_id
document_id
revision_id
distribution_id
user_id
acknowledged_at
acknowledgement_method
ip_address optional
user_agent optional
status
created_at
updated_at
```

## document_controlled_copies

```text
id
company_id
document_id
revision_id
copy_number
copy_holder_type
copy_holder_user_id optional
copy_holder_department_id optional
copy_holder_location_id optional
issued_by
issued_at
revoked_by optional
revoked_at optional
status
remarks
created_at
updated_at
```

## document_links

```text
id
company_id
document_id
revision_id optional
linked_module
linked_record_id
link_type
created_by
created_at
```

## Index Wajib

```text
company_id
document_number
document_type_id
document_category_id
owner_department_id
status
next_review_date
effective_date
expiry_date
current_revision_id
latest_published_revision_id
```

## Relasi Core

```text
attachments/files → document_files
workflow_instances → document/revision
audit_logs → module=document_control
notifications → review/approval/distribution/ack
comments → document/revision
qr_codes → document_qr_codes
```
