# 02 — PERMIT TO WORK GENERATING RULES

## Aturan Utama

1. Jangan hardcode permit type.
2. Permit type dan requirement harus configurable.
3. Gunakan workflow engine, jangan hardcode approval.
4. Gunakan attachment core untuk evidence.
5. Gunakan action tracking core untuk follow-up.
6. Gunakan audit log untuk semua critical status changes.
7. Gunakan notification core untuk approval/expiry/suspend/close-out.
8. Permit aktif harus muncul di Active Permit Board.
9. Permit harus bisa QR verification.
10. Permit harus bisa extension, suspension, cancellation, dan close-out.
11. JSA/Risk link harus optional/mandatory tergantung permit type.
12. Worker competency validation harus configurable: block atau warning.
13. Equipment certificate validation harus configurable: block atau warning.
14. SIMOPS / clash detection minimal berdasarkan lokasi dan waktu.

## Status Permit

```text
draft
submitted
under_review
revision_required
approved
active
work_in_progress
extension_requested
extended
suspended
closeout_submitted
closed
expired
cancelled
archived
```

## Status Gas Test

```text
not_required
required
pending
passed
failed
expired
```

## Status LOTO

```text
not_required
planned
applied
verified
removed
cancelled
```

## Status SIMOPS

```text
not_checked
clear
conflict_detected
approved_with_control
rejected
```

## Permission Standard

```text
permit.view
permit.view_all
permit.create
permit.update
permit.delete
permit.submit
permit.review
permit.approve
permit.activate
permit.extend
permit.suspend
permit.close
permit.cancel
permit.export
permit.manage_settings

permit.gas_test.create
permit.gas_test.verify
permit.loto.create
permit.loto.verify
permit.simops.review
permit.qr.verify
```

## Audit Log Wajib

```text
permit.created
permit.updated
permit.submitted
permit.reviewed
permit.approved
permit.activated
permit.extended
permit.suspended
permit.closeout_submitted
permit.closed
permit.cancelled
permit.expired
gas_test.created
gas_test.verified
loto.applied
loto.verified
loto.removed
simops.conflict_detected
qr.verified
report.exported
```

## Webhook Events

```text
permit.created
permit.submitted
permit.approved
permit.activated
permit.expiring
permit.expired
permit.extended
permit.suspended
permit.closed
permit.cancelled
permit.gas_test_failed
permit.loto_applied
permit.simops_conflict
permit.qr_verified
```
