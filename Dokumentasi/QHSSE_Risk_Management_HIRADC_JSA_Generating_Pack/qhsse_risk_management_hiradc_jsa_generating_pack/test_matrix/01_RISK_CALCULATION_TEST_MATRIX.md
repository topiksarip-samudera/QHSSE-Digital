# Risk Calculation Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| RC-001 | Severity 1 x Likelihood 1 | Correct low risk cell |
| RC-002 | Severity max x Likelihood max | Correct extreme risk cell |
| RC-003 | Change matrix draft | Does not affect published old assessment |
| RC-004 | Calculate initial risk | Backend returns correct level |
| RC-005 | Calculate residual risk | Backend returns correct level |
| RC-006 | Invalid severity/likelihood | Validation error |
| RC-007 | High risk | Required action flag true |
| RC-008 | Extreme risk | Required approval flag true |
| RC-009 | Matrix version archived | Cannot be used for new assessment |
| RC-010 | Cross-company matrix access | Denied |
