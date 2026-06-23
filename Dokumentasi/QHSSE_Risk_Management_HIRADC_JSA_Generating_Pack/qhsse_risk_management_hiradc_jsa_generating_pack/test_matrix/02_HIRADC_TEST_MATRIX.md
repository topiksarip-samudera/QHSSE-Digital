# HIRADC Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| HIR-001 | Create HIRADC draft | Success |
| HIR-002 | Add activity row | Success |
| HIR-003 | Add hazard to activity | Success |
| HIR-004 | Calculate initial risk | Correct risk level |
| HIR-005 | Add additional control | Success |
| HIR-006 | Calculate residual risk | Correct risk level |
| HIR-007 | Submit HIRADC | Workflow started |
| HIR-008 | Approve HIRADC | Status approved/active |
| HIR-009 | High residual risk without action | Block/warning based on settings |
| HIR-010 | Company A access Company B HIRADC | Denied |
