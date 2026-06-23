# Document Core Test Matrix

| ID | Area | Scenario | Expected |
|---|---|---|---|
| DOC-001 | Document Register | Create document | Success |
| DOC-002 | Metadata | Required metadata missing | Validation error |
| DOC-003 | File | Upload allowed file | Success |
| DOC-004 | File | Upload blocked file type | Fail |
| DOC-005 | Workflow | Submit for review | Workflow started |
| DOC-006 | Workflow | Approve revision | Status approved |
| DOC-007 | Publishing | Publish revision | Status published |
| DOC-008 | Immutable | Edit published revision | Blocked; create new revision required |
