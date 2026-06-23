# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Permit

```text
permit.view
permit.view_all
permit.create
permit.update
permit.delete
permit.submit
permit.review
permit.approve
permit.reject
permit.request_revision
permit.activate
permit.extend
permit.suspend
permit.resume
permit.close
permit.cancel
permit.export
permit.manage_settings
```

### Gas Test

```text
permit.gas_test.view
permit.gas_test.create
permit.gas_test.update
permit.gas_test.verify
```

### LOTO

```text
permit.loto.view
permit.loto.create
permit.loto.apply
permit.loto.verify
permit.loto.remove
```

### SIMOPS

```text
permit.simops.view
permit.simops.check
permit.simops.approve
permit.simops.reject
```

### QR

```text
permit.qr.generate
permit.qr.verify
```

## Scope

```text
Global
Company
Site
Project
Department
Location
Own
Assigned
Area Owner
Permit Issuer
HSE Reviewer
Contractor
Worker
Security Viewer
```

## Security Rules

- Semua query wajib filter company_id.
- User Site A tidak boleh melihat permit Site B kecuali punya scope company/global.
- Contractor hanya melihat permit yang terkait perusahaannya.
- Worker hanya melihat permit yang melibatkan dirinya jika diberikan akses.
- Security viewer hanya boleh scan/verify QR dan melihat ringkasan permit.
- QR verification tidak boleh membuka data sensitif.
- Gas test hanya boleh dibuat/verifikasi oleh role yang berwenang.
- LOTO remove harus butuh permission khusus.
- Suspend permit harus butuh permission khusus.
- Export permit report harus audit logged.
- Permit close-out harus memastikan critical requirement selesai.
