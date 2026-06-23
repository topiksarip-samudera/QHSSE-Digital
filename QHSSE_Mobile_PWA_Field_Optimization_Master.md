# START HERE — QHSSE Mobile/PWA Field Optimization Generating Pack

Paket ini dibuat untuk generate tahap **Mobile/PWA Field Optimization** pada WebApp QHSSE.

## Rekomendasi Split

Mobile/PWA Field Optimization sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & PWA Core Setup
02 Mobile Layout, Navigation & Responsive UI
03 Offline Storage, Cache & Sync Engine
04 Mobile Field Form Engine
05 Camera, Evidence, Attachment & Compression
06 QR / Barcode Scanner & Field Verification
07 GPS, Location, Signature & Timestamp
08 Push Notification & Mobile Reminder
09 Mobile Incident, Inspection, Permit & Action Workflow
10 Mobile Asset, Document, Emergency & Contractor Field Use
11 Offline Queue, Conflict Resolution, Security & Device Control
12 QA, Field Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Tahap ini bukan membuat aplikasi mobile baru dari nol, tetapi mengoptimalkan WebApp QHSSE agar kuat dipakai di lapangan:

```text
PWA installable app
Mobile responsive UI
Offline data capture
Offline sync
Camera evidence
QR / barcode scan
GPS location
Digital signature
Push notification
Field workflow
Offline conflict resolution
Mobile security
Device control
Field QA
```

Jika dibuat terlalu sedikit sequence, biasanya offline sync, conflict resolution, device security, dan field QA tidak matang.

## Modul yang Harus Terintegrasi

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
AI Assistant
```

## Cara Pakai

1. Extract ZIP.
2. Baca `00_PROMPT_AWAL_MOBILE_PWA_FIELD_OPTIMIZATION.md`.
3. Baca `01_MOBILE_PWA_MASTER_BLUEPRINT.md`.
4. Baca `02_MOBILE_PWA_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_pwa_core_setup.md`.
6. Kerjakan satu sequence saja.
7. Setelah selesai tulis status sequence.
8. Jangan lanjut sebelum diminta continue.

## Status Akhir

```text
MOBILE PWA FIELD OPTIMIZATION STABILIZED: GO
```


---

# 00 — PROMPT AWAL MOBILE/PWA FIELD OPTIMIZATION UNTUK AI AGENT

Core Platform, QHSSE Operational Modules, Reports & Analytics, dan AI Assistant sudah selesai atau siap integrasi.

Modul yang harus dioptimalkan untuk mobile/field:

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
AI Assistant
```

Sekarang generate tahap **Mobile/PWA Field Optimization** berdasarkan folder `qhsse_mobile_pwa_field_optimization_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_pwa_core_setup.md`.
3. Mobile/PWA tidak boleh hanya responsive CSS.
4. Harus ada PWA manifest, service worker, app shell, install prompt, dan offline readiness.
5. Harus ada mobile-first layout dan field UX.
6. Harus ada offline storage, cache, queue, sync, dan conflict resolution.
7. Harus ada field form engine untuk mobile/offline.
8. Harus ada camera evidence dan attachment compression.
9. Harus ada QR/barcode scanner.
10. Harus ada GPS, signature, timestamp, dan audit trail.
11. Harus ada push notification dan mobile reminder.
12. Harus ada mobile workflow untuk incident, inspection, permit, action, asset, document, emergency, contractor.
13. Harus ada mobile security dan device control.
14. Semua data wajib tenant-safe dan permission-guarded.
15. Semua sync, evidence upload, QR scan, GPS, signature, device registration, dan export wajib audit logged.
16. Setelah sequence selesai, tulis:
   `SELESAI MOBILE PWA SEQUENCE XX: <nama sequence>`
17. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT MOBILE/PWA FIELD OPTIMIZATION

## Tujuan

Mobile/PWA Field Optimization membuat WebApp QHSSE siap dipakai di lapangan oleh HSE officer, supervisor, inspector, permit issuer, security, emergency team, contractor reviewer, dan management.

Targetnya adalah PWA yang cepat, responsive, offline-capable, aman, dan terintegrasi ke seluruh modul QHSSE.

## Prinsip Desain

1. Mobile/PWA bukan sekadar responsive CSS.
2. Harus installable sebagai PWA.
3. Harus punya offline-first untuk field form.
4. Harus punya sync engine.
5. Harus punya evidence capture dari kamera.
6. Harus punya QR scanner.
7. Harus punya GPS, signature, timestamp.
8. Harus punya push notification.
9. Harus support field workflow lintas modul.
10. Harus tetap tenant-safe, permission-aware, dan audit-logged.
11. Harus tetap ringan untuk koneksi buruk.
12. Harus punya conflict resolution saat data offline berubah.

## Field Use Case

```text
Incident report dari HP
Near miss report dari HP
Inspection checklist mobile
Audit field evidence
Permit approval mobile
Permit QR verification
Action close-out dengan foto
Asset QR scan
Asset inspection mobile
Document QR scan
Worker certificate QR validation
Contractor equipment validation
Emergency contact quick access
Drill attendance mobile
GPS evidence
Digital signature
Offline form draft
Push approval reminder
```

## Target User

```text
HSE Officer
Supervisor
Inspector
Auditor
Permit Issuer
Permit Approver
Security Officer
Emergency Team
Maintenance Team
Contractor Coordinator
Management Viewer
```

## PWA Capability

```text
Installable app
App manifest
Service worker
Offline app shell
Background sync
Push notification
IndexedDB storage
Camera access
GPS access
QR scanner
File upload
Signature pad
Mobile cache
Secure session
```


---

# 02 — MOBILE/PWA GENERATING RULES

## Aturan Utama

1. Jangan hanya membuat responsive layout.
2. PWA harus punya manifest dan service worker.
3. Data field penting harus bisa dibuat sebagai offline draft.
4. Offline queue harus bisa retry.
5. Conflict resolution wajib ada untuk update data yang berubah saat offline.
6. Evidence foto/video harus dikompresi.
7. Evidence harus menyimpan metadata: time, user, GPS optional, module, record.
8. QR scan harus permission-aware.
9. GPS harus meminta consent user.
10. Signature harus disimpan sebagai evidence.
11. Push notification harus bisa ON/OFF per user.
12. Device/session harus bisa dikontrol admin.
13. Semua offline sync harus audit logged.
14. Semua API mobile wajib tenant-safe dan permission-guarded.

## Permission Standard

```text
mobile.view
mobile.install
mobile.offline_use
mobile.sync
mobile.capture_evidence
mobile.scan_qr
mobile.capture_gps
mobile.sign
mobile.receive_push
mobile.manage_device
mobile.manage_settings

mobile.incident.create
mobile.inspection.execute
mobile.permit.approve
mobile.permit.verify
mobile.action.close
mobile.asset.verify
mobile.document.view
mobile.contractor.verify
mobile.emergency.view
```

## Audit Log Wajib

```text
mobile.app.installed
mobile.offline_draft_created
mobile.offline_queue_created
mobile.sync_started
mobile.sync_completed
mobile.sync_failed
mobile.conflict_detected
mobile.conflict_resolved
mobile.evidence_captured
mobile.qr_scanned
mobile.gps_captured
mobile.signature_captured
mobile.push_sent
mobile.push_acknowledged
mobile.device_registered
mobile.device_blocked
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
mobile_pwa_settings
mobile_devices
mobile_device_sessions
mobile_feature_toggles
mobile_offline_profiles
mobile_offline_drafts
mobile_offline_queue
mobile_sync_logs
mobile_sync_conflicts
mobile_evidence_captures
mobile_qr_scan_logs
mobile_location_captures
mobile_signatures
mobile_push_subscriptions
mobile_push_logs
mobile_field_forms
mobile_field_form_templates
mobile_field_form_submissions
mobile_app_audit_logs
```

## mobile_devices

```text
id
company_id
user_id
device_uid
device_name
device_type
os
browser
pwa_installed
last_seen_at
is_trusted
is_blocked
status
created_at
updated_at
```

## mobile_offline_drafts

```text
id
company_id
user_id
device_id
module_key
record_type
local_record_id
server_record_id optional
payload_json
status
created_at
updated_at
last_sync_attempt_at optional
```

## mobile_offline_queue

```text
id
company_id
user_id
device_id
queue_type
module_key
operation
endpoint
method
payload_json
retry_count
max_retry
status
error_message optional
created_at
updated_at
```

## mobile_sync_conflicts

```text
id
company_id
user_id
device_id
module_key
local_record_id
server_record_id
conflict_type
local_payload_json
server_payload_json
resolution_strategy
resolved_by optional
resolved_at optional
status
created_at
```

## mobile_evidence_captures

```text
id
company_id
user_id
device_id
module_key
record_id optional
file_id
file_type
original_size
compressed_size
gps_lat optional
gps_lng optional
captured_at
metadata_json
status
created_at
```

## mobile_qr_scan_logs

```text
id
company_id
user_id
device_id
qr_type
qr_value
module_key optional
record_id optional
scan_result
gps_lat optional
gps_lng optional
scanned_at
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## PWA & Device

```text
GET    /mobile-pwa/settings
PATCH  /mobile-pwa/settings
POST   /mobile-pwa/devices/register
GET    /mobile-pwa/devices
PATCH  /mobile-pwa/devices/:id
POST   /mobile-pwa/devices/:id/block
POST   /mobile-pwa/devices/:id/trust
```

## Offline & Sync

```text
GET    /mobile-pwa/offline-profile
POST   /mobile-pwa/offline-drafts
GET    /mobile-pwa/offline-drafts
PATCH  /mobile-pwa/offline-drafts/:id
DELETE /mobile-pwa/offline-drafts/:id
POST   /mobile-pwa/sync/push
POST   /mobile-pwa/sync/pull
POST   /mobile-pwa/sync/resolve-conflict
GET    /mobile-pwa/sync/logs
GET    /mobile-pwa/sync/conflicts
```

## Evidence, QR, GPS, Signature

```text
POST /mobile-pwa/evidence
GET  /mobile-pwa/evidence/:id
POST /mobile-pwa/qr/scan
POST /mobile-pwa/location/capture
POST /mobile-pwa/signatures
GET  /mobile-pwa/signatures/:id
```

## Field Workflow

```text
POST /mobile/incident/report
POST /mobile/inspection/execute
POST /mobile/permit/:id/approve
POST /mobile/permit/:id/verify-qr
POST /mobile/actions/:id/close
POST /mobile/assets/:id/verify
POST /mobile/documents/verify-qr
POST /mobile/contractors/verify-worker
POST /mobile/emergency/drill-attendance
```

## Push Notification

```text
POST /mobile-pwa/push/subscribe
DELETE /mobile-pwa/push/unsubscribe
GET /mobile-pwa/push/logs
POST /mobile-pwa/push/test
```


---

# 05 — UI/UX GUIDE MOBILE/PWA

## Mobile Navigation

```text
Home
Tasks
Scan
Create
Notifications
Profile
```

## Field Home

```text
My Pending Approvals
My Open Actions
Quick Incident Report
Start Inspection
Scan QR
Offline Queue Status
Emergency Contact
```

## Components

```text
MobileShell
BottomNavigation
OfflineStatusBar
SyncStatusBadge
InstallPwaPrompt
MobileTaskCard
CameraCapture
EvidencePreview
QRScanner
GPSCaptureButton
SignaturePad
MobileFormBuilder
MobileChecklist
PushNotificationToggle
ConflictResolutionDialog
```

## UX Rules

- Button harus besar dan touch-friendly.
- Form harus bisa disimpan sebagai draft.
- Offline status harus selalu terlihat.
- Sync status harus jelas.
- Kamera dan QR scanner harus cepat diakses.
- Critical action seperti approve/reject tetap butuh confirmation.
- Semua error sync harus dapat dibaca user.


---

# 06 — PERMISSION & SECURITY GUIDE

## Security Rules

- Mobile API wajib tenant-safe.
- Offline profile hanya memuat data yang user boleh akses.
- Offline cache tidak boleh menyimpan data sensitif tanpa proteksi.
- QR scan harus verify permission backend.
- Device dapat diblock admin.
- Session mobile harus bisa revoked.
- Signature dan GPS harus audit logged.
- Evidence file harus permission-guarded.
- Push notification tidak boleh membocorkan data sensitif.
- Conflict resolution harus permission-aware.

## Device Control

```text
Register device
Trust device
Block device
Revoke session
Limit offline data
Limit attachment size
Limit sync retry
Force logout
```


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
PWA Install
Service Worker
Offline App Shell
Offline Draft
Offline Queue
Sync Push/Pull
Conflict Resolution
Camera Evidence
Attachment Compression
QR Scanner
GPS Capture
Signature
Push Notification
Mobile Incident
Mobile Inspection
Mobile Permit
Mobile Asset QR
Mobile Document QR
Mobile Contractor Verification
Device Control
Permission
Tenant Isolation
Performance
Field Test
```

## Release Gate

```text
P0 = 0
P1 = 0
PWA install PASS
Offline draft PASS
Offline queue PASS
Sync engine PASS
Conflict resolution PASS
Camera evidence PASS
QR scan PASS
GPS/signature PASS
Push notification PASS
Mobile workflows PASS
Device control PASS
Tenant isolation PASS
Permission backend PASS
Audit log PASS
Field test PASS
Lint/test/build PASS
```

Status akhir:

```text
MOBILE PWA FIELD OPTIMIZATION STABILIZED: GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Integrasi Modul

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
AI Assistant
```

## Mapping Ringkas

```text
Incident → mobile incident report, photo, witness, GPS
Audit & Inspection → checklist mobile, evidence, finding, action
Permit to Work → mobile approval, QR permit, field verification
Document Control → QR document, mobile controlled view
Training → QR certificate and worker validation
Asset & Equipment → QR asset, inspection, certificate status
Emergency → contact, muster point, drill attendance
Contractor → worker/equipment validation
AI Assistant → mobile copilot and field guidance
Reports & Analytics → mobile dashboard summary
```


---

# Mobile/PWA Field Optimization Sequence

```text
01 Foundation & PWA Core Setup
02 Mobile Layout, Navigation & Responsive UI
03 Offline Storage, Cache & Sync Engine
04 Mobile Field Form Engine
05 Camera, Evidence, Attachment & Compression
06 QR / Barcode Scanner & Field Verification
07 GPS, Location, Signature & Timestamp
08 Push Notification & Mobile Reminder
09 Mobile Incident, Inspection, Permit & Action Workflow
10 Mobile Asset, Document, Emergency & Contractor Field Use
11 Offline Queue, Conflict Resolution, Security & Device Control
12 QA, Field Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Mobile/PWA Field Optimization Sequence. Kerjakan sequence berikutnya sesuai sequence/00_MOBILE_PWA_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
MOBILE PWA FIELD OPTIMIZATION STABILIZED: GO
```
