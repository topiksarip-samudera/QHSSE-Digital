# SELESAI CORE: Authentication & Session Management

## Status: ✅ COMPLETE

### Database Schema
- **PasswordResetToken model** — id, userId, tokenHash (unique), expiresAt, usedAt, createdAt. Cascade delete from User.
- **User model updated** — added loginAttempts (Int, default 0), lockedUntil (DateTime?), passwordChangedAt (DateTime?), passwordResetTokens relation.
- **LoginHistory model** — id, userId, email, status, ipAddress, userAgent, failureReason, createdAt. Indexed on userId, email, status.
- Schema validated + Prisma client generated (v6.19.3).

### Backend API (apps/api/src/auth/)
- `auth.service.ts` — Fully rewritten with 14 methods:
  - `login()` — Enhanced with login history, account lockout (5 attempts → 15 min), company status check
  - `register()` — Enhanced with password policy validation
  - `refreshTokens()` — Unchanged
  - `logout()` — Unchanged
  - `getProfile()` — Enhanced with full relations
  - `changePassword(userId, currentPassword, newPassword)` — NEW
  - `forgotPassword(email)` — NEW — generates reset token, returns raw token in non-production
  - `resetPassword(token, newPassword)` — NEW — validates token, updates password, revokes all tokens
  - `getSessions(userId)` — NEW — lists active refresh tokens
  - `revokeSession(userId, sessionId)` — NEW — force-revoke single session
  - `revokeAllSessions(userId)` — NEW — force-revoke all sessions
  - `logLoginHistory()` — Private helper
  - `validatePasswordPolicy()` — Module-level function (minLength 8, maxLength 128, uppercase, lowercase, number, special char)
  - Constants: MAX_LOGIN_ATTEMPTS=5, LOCKOUT_DURATION_MINUTES=15

- `auth.controller.ts` — 12 endpoints:
  - `POST /auth/login` (@Public)
  - `POST /auth/register` (@Public)
  - `POST /auth/refresh` (@Public)
  - `POST /auth/logout` (@ApiBearerAuth)
  - `GET /auth/me` (@ApiBearerAuth) — NEW primary
  - `GET /auth/profile` (@ApiBearerAuth) — backward compat alias
  - `POST /auth/forgot-password` (@Public) — NEW
  - `POST /auth/reset-password` (@Public) — NEW
  - `POST /auth/change-password` (@ApiBearerAuth) — NEW
  - `GET /auth/sessions` (@ApiBearerAuth) — NEW
  - `DELETE /auth/sessions/:sessionId` (@ApiBearerAuth) — NEW
  - `DELETE /auth/sessions` (@ApiBearerAuth) — NEW (revoke all)

- DTOs created:
  - `dto/forgot-password.dto.ts` — email (IsEmail)
  - `dto/reset-password.dto.ts` — token (IsString), newPassword (MinLength 8, MaxLength 128)
  - `dto/change-password.dto.ts` — currentPassword (IsString), newPassword (MinLength 8, MaxLength 128)

### Permissions
- `'authentication'` module added to seed.ts modules array
- Actions: view, create, update, delete, export

### Frontend (apps/web/src/)
- `lib/api.ts` — authApi extended with: forgotPassword, resetPassword, changePassword, getSessions, revokeSession, revokeAllSessions
- `app/forgot-password/page.tsx` — Email input, success state with dev token display
- `app/reset-password/page.tsx` — Token input (auto-filled from URL), new password + confirm, wrapped in Suspense
- `app/dashboard/settings/change-password/page.tsx` — Current + new password form with policy hints
- `app/dashboard/settings/sessions/page.tsx` — Active session list with per-session revoke + revoke all
- `app/login/page.tsx` — Updated with "Forgot your password?" link
- `app/dashboard/layout.tsx` — Settings sidebar group added with Change Password + Active Sessions

### Tests
- `auth/__tests__/auth.service.spec.ts` — 30 tests covering:
  - Login: success, invalid email, locked account, inactive account, no active company, wrong password + increment attempts, lock after max attempts, super admin bypass
  - Register: success, duplicate email, weak passwords (no uppercase, no number, too short)
  - Change Password: success, user not found, wrong current password, same password, weak new password
  - Forgot Password: creates token, prevents email enumeration
  - Reset Password: valid token, invalid token, weak password
  - Sessions: list active, revoke specific, revoke all
  - Logout: revoke all, revoke specific
  - Refresh Tokens: invalid token

### Build Verification
- `pnpm run build` — 3/3 packages successful (shared, api, web)
- `pnpm run test --filter=api` — **140 tests passed across 8 test files** (0 failures)

### Business Rules Implemented
- ✅ Password hashed (bcryptjs, 12 rounds)
- ✅ Token expiry (refresh 7 days, reset 1 hour)
- ✅ Failed login logged (LoginHistory model)
- ✅ Refresh token revocable (per-session and all)
- ✅ Inactive/suspended company cannot login
- ✅ Password policy enforced (min 8, uppercase, lowercase, number, special)
- ✅ Account lockout after 5 failed attempts (15 min)
- ✅ Email enumeration prevention on forgot-password
- ✅ All sessions revoked on password change/reset
- ✅ No hardcoded values (constants at top of service)

### Limitations (No Local DB)
- PostgreSQL not running locally / no Docker — migration not applied
- Seed not verified against actual database
- All code, build, and tests verified without database connection
