# SELESAI CORE: AI Governance (Phase 3 — Core 07)

**Status:** COMPLETE (2026-06-22) | **Tests:** 456 cumulative

## Features

### Database (7 tables)
- `ai_settings` — Global AI ON/OFF, allowed modules/roles, data redaction
- `ai_permissions` — Per-role AI feature gating (generate/analyze/summarize/recommend)
- `ai_prompt_templates` — Module-scoped reusable prompts
- `ai_knowledge_sources` — Document/policy/procedure/regulation sources
- `ai_usage_logs` — Prompt/response, token tracking (in/out), duration, cost estimation
- `ai_output_reviews` — 1-5 rating, notes, approved flag
- `ai_provider_configs` — OpenAI/Azure/Anthropic/Google config (model, tokens, temperature)

### Backend API (`/api/v1/ai`)
- `GET/PATCH /settings` — Company AI configuration
- `POST/GET/DELETE /prompt-templates` — Prompt management
- `POST/GET /knowledge-sources` — Knowledge base
- `GET /usage-logs` — Paginated AI usage audit
- `POST /output-reviews` — Human review of AI output
- `GET/POST /provider-config` — AI provider configuration

### Frontend
- 4-tab page: Settings (enable/disable, allowed modules, data redaction), Prompt Templates, Knowledge Sources, Usage Logs (tokens/duration/cost table)

**Build:** API ✅ | Web ✅ | **Tests:** 456/456 PASS
