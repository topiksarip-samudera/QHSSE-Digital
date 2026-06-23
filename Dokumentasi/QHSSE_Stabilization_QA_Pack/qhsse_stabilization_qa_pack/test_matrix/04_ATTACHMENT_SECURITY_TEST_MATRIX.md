# Attachment Security Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| FS-001 | Upload PDF | Success |
| FS-002 | Upload blocked extension | Fail |
| FS-003 | Upload over size limit | Fail |
| FS-004 | Download without login | 401 |
| FS-005 | Download without permission | 403 |
| FS-006 | Company A downloads Company B file | 403/404 |
| FS-007 | Raw file URL opened public | Denied |
| FS-008 | Delete attachment | Soft deleted |
| FS-009 | Download deleted attachment | 404 |
| FS-010 | Upload/download audit log | Created if required |
