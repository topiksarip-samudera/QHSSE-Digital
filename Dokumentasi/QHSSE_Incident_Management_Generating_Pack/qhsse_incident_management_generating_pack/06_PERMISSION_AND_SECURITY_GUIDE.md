# 06 — INCIDENT PERMISSION & SECURITY GUIDE

## Permission List

```text
incident.view
incident.view_all
incident.create
incident.update
incident.delete
incident.submit
incident.review
incident.reject
incident.classify
incident.assign_investigator
incident.investigate
incident.rca
incident.capa
incident.verify
incident.approve_close
incident.close
incident.export
incident.report
incident.upload_evidence
incident.download_evidence
incident.comment
incident.view_audit
incident.lessons_learned
incident.publish_lessons_learned
incident.manage_settings
```

## Scope

```text
own
assigned
department
site
company
global
```

## Rule Contoh

```text
Employee:
- create own incident
- view own incident
- comment own incident

HSE Officer:
- view site incidents
- review site incidents
- investigate assigned incidents
- create CAPA

Site Manager:
- approve close high severity
- view site dashboard

Corporate QHSSE:
- view company-wide incidents
- approve high severity
- export reports

Contractor:
- create contractor incident
- view own contractor incidents
- cannot view internal notes
```

## Security Test Wajib

```text
User Company A tidak bisa akses incident Company B
User tanpa incident.view tidak bisa list/detail
User tanpa incident.update tidak bisa edit
User tanpa incident.review tidak bisa review
User tanpa incident.close tidak bisa close
User tanpa incident.download_evidence tidak bisa download evidence
Contractor tidak bisa view internal note
Export harus sesuai scope
Dashboard harus sesuai scope
```
