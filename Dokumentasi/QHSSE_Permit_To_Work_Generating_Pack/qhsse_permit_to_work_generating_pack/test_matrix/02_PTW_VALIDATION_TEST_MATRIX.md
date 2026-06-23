# PTW Validation Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| VAL-001 | Permit type requires JSA but no JSA attached | Block/warn based on config |
| VAL-002 | Worker certificate expired | Block/warn based on config |
| VAL-003 | Equipment certificate expired | Block/warn based on config |
| VAL-004 | Gas test required but missing | Block activation |
| VAL-005 | Gas test failed | Block activation |
| VAL-006 | LOTO required but not verified | Block activation |
| VAL-007 | SIMOPS conflict detected | Require approval/control |
| VAL-008 | Close-out with LOTO not removed | Block close-out |
