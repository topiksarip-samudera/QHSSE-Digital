# Incident Workflow Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| INC-WF-001 | Draft submit | Status submitted |
| INC-WF-002 | Initial reviewer review | Status in review/classification |
| INC-WF-003 | Reject without comment | Validation error |
| INC-WF-004 | Request revision | Status revision_required |
| INC-WF-005 | Assign investigator | Investigator notification |
| INC-WF-006 | Submit investigation | Status RCA in progress |
| INC-WF-007 | Submit RCA | Status CAPA assigned |
| INC-WF-008 | Close with open CAPA | Blocked if required |
| INC-WF-009 | Close after CAPA verified | Closed |
| INC-WF-010 | Workflow history | Complete |
