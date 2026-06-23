# PTW QR & Active Board Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| QR-001 | Generate QR for approved permit | QR generated |
| QR-002 | Scan active permit QR | Valid summary shown |
| QR-003 | Scan expired permit QR | Expired warning |
| QR-004 | Scan suspended permit QR | Suspended warning |
| QR-005 | Unauthenticated QR scan | Only allowed safe summary or requires auth based config |
| AB-001 | Activate permit | Appears on active board |
| AB-002 | Close permit | Removed from active board |
| AB-003 | Filter board by site/location/type | Accurate |
| AB-004 | Company A board | No Company B permits |
