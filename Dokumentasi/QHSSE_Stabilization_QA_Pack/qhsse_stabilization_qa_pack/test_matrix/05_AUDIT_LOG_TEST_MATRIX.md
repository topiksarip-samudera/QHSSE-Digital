# Audit Log Test Matrix

| ID | Action | Expected Audit |
|---|---|---|
| AL-001 | Login success | login_success |
| AL-002 | Login fail | login_failed |
| AL-003 | Create record | create with actor/company/module |
| AL-004 | Update record | old_value/new_value |
| AL-005 | Delete/archive | delete/archive event |
| AL-006 | Approve | workflow.approve |
| AL-007 | Reject | workflow.reject + comment |
| AL-008 | Change permission | permission_change |
| AL-009 | Change module setting | settings_change |
| AL-010 | Export data | export event |
