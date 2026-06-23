# Tenant Isolation Test Matrix

## Data Setup

```text
Company A
- User A Admin
- User A HSE
- Site A1
- Department A1
- Action A
- Attachment A

Company B
- User B Admin
- User B HSE
- Site B1
- Department B1
- Action B
- Attachment B
```

## Test Cases

| ID | Scenario | Expected |
|---|---|---|
| TI-001 | User A list actions | Only Action A |
| TI-002 | User A direct API Action B | 403/404 |
| TI-003 | User A search keyword from Company B | No result |
| TI-004 | User A dashboard | Count only Company A |
| TI-005 | User A download Attachment B | 403/404 |
| TI-006 | User A export actions | Only Company A |
| TI-007 | Super Admin access Company B | Allowed with audit log |
| TI-008 | Company suspended login | Blocked |
