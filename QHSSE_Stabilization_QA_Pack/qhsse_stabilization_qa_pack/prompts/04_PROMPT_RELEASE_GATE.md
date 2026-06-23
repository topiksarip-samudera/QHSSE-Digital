# Prompt Release Gate

Jalankan release gate untuk Core Platform.

Cek:
- P0 = 0
- P1 = 0
- Tenant isolation PASS
- Permission backend PASS
- File security PASS
- Audit log PASS
- Workflow PASS
- Lint PASS
- Test PASS
- Build PASS

Buat `RELEASE_GATE_DECISION.md`.

Jika lulus tulis:

```text
CORE PLATFORM STABILIZED: GO
```

Jika tidak lulus tulis:

```text
CORE PLATFORM STABILIZED: NO-GO
```

dan daftar blocking issue.
