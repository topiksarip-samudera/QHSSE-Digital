# Dashboard & Report Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| DR-001 | Risk dashboard count | Correct |
| DR-002 | Risk heatmap | Correct residual distribution |
| DR-003 | Filter dashboard by site | Scoped count |
| DR-004 | Top hazards | Correct ordering |
| DR-005 | Overdue review count | Correct |
| DR-006 | Open risk action count | Correct |
| DR-007 | Export risk register Excel | Success, scoped data only |
| DR-008 | Export HIRADC PDF | Success |
| DR-009 | Export JSA PDF | Success |
| DR-010 | Export without permission | 403 |
