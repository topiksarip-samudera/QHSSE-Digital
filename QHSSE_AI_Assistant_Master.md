# START HERE — QHSSE AI Assistant Generating Pack

Paket ini dibuat untuk generate modul **AI Assistant / QHSSE Copilot** pada WebApp QHSSE.

## Rekomendasi Split

AI Assistant sebaiknya di-split menjadi **14 sequence**.

```text
01 Foundation & AI Provider Configuration
02 AI Chat Workspace Core
03 AI Permission, Scope & Guardrail
04 Knowledge Base & Document RAG
05 Module Data Context Connector
06 Incident RCA & Investigation Assistant
07 Risk, HIRADC & JSA Assistant
08 Permit to Work Review Assistant
09 Audit, Inspection & CAPA Assistant
10 Legal, Compliance & Document Assistant
11 Reports, Analytics & Executive Summary Assistant
12 Prompt Template, Skill & Workflow Library
13 AI Usage Log, Token Cost, Rate Limit & Admin Control
14 QA, Security Test, Permission & Stabilization
```

## Kenapa 14 Sequence?

AI Assistant lebih sensitif dibanding modul biasa karena menyentuh provider key, RAG, permission-aware context, module connector, prompt injection defense, usage cost, rate limit, dan security QA.

## Sumber Data AI

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
```

## Tujuan Modul

Membangun QHSSE Copilot yang dapat menjawab berbasis data, membantu RCA, HIRADC/JSA, review PTW, audit/CAPA, compliance, executive summary, dan document Q&A dengan permission, scope, guardrail, citation, token usage, dan audit log.

## Cara Pakai

1. Extract ZIP.
2. Baca `00_PROMPT_AWAL_AI_ASSISTANT.md`.
3. Baca `01_AI_ASSISTANT_MASTER_BLUEPRINT.md`.
4. Mulai dari `sequence/01_foundation_ai_provider_configuration.md`.
5. Kerjakan satu sequence saja.
6. Setelah selesai tulis status sequence.
7. Jangan lanjut sebelum diminta continue.

## Status Akhir

```text
AI ASSISTANT STABILIZED: GO
```


---

# 00 — PROMPT AWAL AI ASSISTANT UNTUK AI AGENT

Core Platform sudah stabil. Semua QHSSE Operational Modules dan Reports & Analytics sudah selesai atau siap integrasi.

Sumber data:

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
```

Sekarang generate **AI Assistant / QHSSE Copilot** berdasarkan folder `qhsse_ai_assistant_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_ai_provider_configuration.md`.
3. AI Assistant tidak boleh menjadi chat biasa saja.
4. Harus ada provider configuration dan secure API key handling.
5. Harus ada chat workspace, RAG, module data connector, permission-aware context, dan source citation.
6. Harus ada guardrail: prompt injection, data leakage, unauthorized access, hallucination control.
7. Harus ada assistant khusus: Incident RCA, Risk/HIRADC/JSA, PTW Review, Audit/CAPA, Legal/Document, Reports/Analytics.
8. Harus ada prompt template, skill, workflow library, usage log, token cost, rate limit, admin control.
9. Semua AI response berbasis data internal wajib punya source reference.
10. Semua AI conversation, context retrieval, export, provider setting, dan guardrail event wajib audit logged.
11. Semua API wajib permission-guarded dan tenant-safe.
12. Setelah selesai tulis: `SELESAI AI ASSISTANT SEQUENCE 01: Foundation & AI Provider Configuration`.
13. Jangan lanjut sequence berikutnya sebelum user meminta continue.


---

# 01 — MASTER BLUEPRINT AI ASSISTANT / QHSSE COPILOT

## Tujuan

AI Assistant adalah QHSSE Copilot yang aman, permission-aware, dan terintegrasi dengan seluruh data QHSSE. AI membantu analisis, rekomendasi, draft, gap finding, dan executive summary berbasis data internal.

## Prinsip Desain

- AI bukan chatbot umum.
- AI harus tenant-safe dan scope-aware.
- AI tidak boleh membaca data yang tidak bisa diakses user.
- AI harus punya guardrail terhadap prompt injection dan data leakage.
- AI response berbasis data internal wajib punya source/citation.
- Provider key harus encrypted.
- Usage, token, cost, latency, provider, model, dan audit log harus tercatat.
- Skill AI harus bisa ON/OFF per tenant, role, dan module.

## Submodul

```text
AI Provider Configuration
Model Registry
AI Chat Workspace
Conversation Thread
Message History
AI Permission & Scope
AI Guardrail
Prompt Injection Defense
Knowledge Base
Document RAG
Vector Index
Module Data Context Connector
Incident RCA Assistant
Risk / HIRADC / JSA Assistant
Permit Review Assistant
Audit / Inspection / CAPA Assistant
Legal / Compliance / Document Assistant
Reports / Analytics Summary Assistant
Prompt Template Library
Skill Library
Workflow Library
AI Usage Log
Token Cost Tracking
Rate Limit
Admin Control
AI Audit Log
```

## Source Modules

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
```


---

# 02 — AI ASSISTANT GENERATING RULES

## Aturan Utama

1. Jangan membuat AI Assistant sebagai chat UI saja.
2. AI harus memakai provider abstraction.
3. Provider API key wajib encrypted at rest.
4. AI context wajib permission-aware.
5. AI tidak boleh mengambil data lintas tenant.
6. AI tidak boleh bypass role/scope/module permission.
7. RAG wajib menyimpan document source/chunk reference.
8. Module data connector wajib membatasi field dan query.
9. Jangan expose raw SQL ke AI.
10. Jangan izinkan AI mengeksekusi action berbahaya tanpa human approval.
11. Semua suggestion harus diberi label `AI generated`.
12. Semua AI response berbasis data internal harus punya source reference.
13. Semua conversation, context retrieval, token usage, provider call, dan export wajib audit log.

## Permission Standard

```text
ai.view
ai.chat
ai.chat_with_documents
ai.chat_with_module_data
ai.use_incident_assistant
ai.use_risk_assistant
ai.use_permit_assistant
ai.use_audit_assistant
ai.use_capa_assistant
ai.use_compliance_assistant
ai.use_report_assistant
ai.create_prompt_template
ai.manage_prompt_template
ai.manage_skills
ai.manage_provider
ai.manage_guardrail
ai.view_usage
ai.manage_usage_limit
ai.export_conversation
ai.delete_conversation
```

## Guardrail Wajib

```text
Prompt injection detection
Unauthorized data request detection
Cross-tenant data prevention
Sensitive field masking
Source-required answer mode
No-source refusal mode
Tool/action approval mode
Rate limit
Token budget
Output safety filter
Internal prompt protection
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
ai_settings
ai_providers
ai_provider_models
ai_model_aliases
ai_tenant_provider_settings
ai_feature_toggles
ai_guardrail_policies
ai_guardrail_events
ai_chat_workspaces
ai_conversations
ai_messages
ai_message_sources
ai_context_requests
ai_knowledge_bases
ai_knowledge_documents
ai_document_chunks
ai_vector_indexes
ai_module_connectors
ai_module_connector_fields
ai_prompt_templates
ai_skills
ai_skill_runs
ai_workflow_templates
ai_usage_logs
ai_cost_logs
ai_rate_limits
ai_admin_controls
ai_audit_logs
```

## Entity Highlights

`ai_providers`: provider_key, provider_name, base_url, api_key_encrypted, auth_type, is_enabled, default_model, timeout_seconds, max_retries.

`ai_conversations`: company_id, workspace_id, conversation_title, mode, module_key, source_record_id, visibility, owner_id, status.

`ai_messages`: conversation_id, role, content, model, provider_key, prompt_tokens, completion_tokens, total_tokens, cost_estimate, latency_ms, guardrail_status.

`ai_message_sources`: message_id, source_type, module_key, record_id, document_id, chunk_id, source_title, confidence_score.

`ai_usage_logs`: user_id, provider_key, model, feature_key, prompt_tokens, completion_tokens, total_tokens, cost, latency_ms, status.


---

# 04 — API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## Provider & Settings

```text
GET    /ai/providers
POST   /ai/providers
GET    /ai/providers/:id
PATCH  /ai/providers/:id
DELETE /ai/providers/:id
POST   /ai/providers/:id/test
POST   /ai/providers/:id/rotate-key
GET    /ai/models
POST   /ai/models/sync
GET    /ai/settings
PATCH  /ai/settings
```

## Chat Workspace

```text
GET    /ai/workspaces
POST   /ai/workspaces
GET    /ai/conversations
POST   /ai/conversations
GET    /ai/conversations/:id/messages
POST   /ai/conversations/:id/messages
POST   /ai/conversations/:id/export
```

## RAG & Context

```text
GET    /ai/knowledge-bases
POST   /ai/knowledge-bases
POST   /ai/knowledge-bases/:id/documents
POST   /ai/documents/:id/index
POST   /ai/rag/search
GET    /ai/module-connectors
POST   /ai/context/preview
POST   /ai/context/retrieve
```

## Skills

```text
POST /ai/skills/incident-rca
POST /ai/skills/risk-assessment
POST /ai/skills/jsa-draft
POST /ai/skills/permit-review
POST /ai/skills/audit-finding
POST /ai/skills/capa-recommendation
POST /ai/skills/compliance-gap
POST /ai/skills/report-summary
POST /ai/skills/executive-insight
```

## Admin

```text
GET /ai/usage
GET /ai/usage/cost
GET /ai/rate-limits
POST /ai/rate-limits
GET /ai/guardrail-events
GET /ai/audit-logs
```


---

# 05 — UI/UX GUIDE AI ASSISTANT

## Sidebar

```text
AI Assistant
├── Chat Workspace
├── Document Q&A
├── Module Data Q&A
├── Incident RCA Assistant
├── Risk / HIRADC / JSA Assistant
├── Permit Review Assistant
├── Audit & CAPA Assistant
├── Compliance Assistant
├── Report Summary Assistant
├── Knowledge Base
├── Prompt Templates
├── Skills & Workflows
├── Usage & Cost
├── Guardrail Events
└── AI Settings
```

## Komponen Wajib

```text
AIChatBox
AIMessageBubble
AISourceCitation
AIContextSelector
AIModuleSelector
AIRecordPicker
AIGuardrailAlert
AIUsageMeter
AIProviderStatus
AIModelSelector
PromptTemplatePicker
SkillRunPanel
```


---

# 06 — PERMISSION & SECURITY GUIDE

## Security Rules

- AI tidak boleh membaca data di luar tenant user.
- AI tidak boleh membaca module yang user tidak punya permission.
- AI tidak boleh bypass site/project/department scope.
- AI tidak boleh melihat field sensitif tanpa permission.
- AI provider key harus encrypted.
- AI system prompt/internal prompt tidak boleh tampil ke user.
- AI response berbasis data internal wajib source reference.
- Prompt injection harus dideteksi dan dicatat.
- AI tool/action execution harus human approval.
- Export conversation harus permission-guarded.
- Admin setting change harus audit logged.

## Sensitive Fields

```text
personal_identity_number
medical_detail
salary
private_contact
security_sensitive_detail
investigation_confidential_note
legal_confidential_note
api_key
provider_secret
internal_prompt
```


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Provider Key Encryption
Chat Workspace
RAG Source Citation
Module Context Permission
Prompt Injection Defense
Cross-Tenant Data Leakage Test
Sensitive Field Masking
Incident RCA Skill
Risk/HIRADC/JSA Skill
Permit Review Skill
Audit/CAPA Skill
Compliance Skill
Report Summary Skill
Usage Log
Token Cost
Rate Limit
Admin Control
Audit Log
Performance
Regression Test
```

## Release Gate

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Provider key encryption PASS
Chat workspace PASS
RAG citation PASS
Module context guard PASS
Prompt injection defense PASS
Cross-tenant leakage test PASS
Sensitive field masking PASS
AI skills PASS
Usage/cost tracking PASS
Rate limit PASS
Audit log PASS
Admin control PASS
Lint/test/build PASS
```

Status akhir:

```text
AI ASSISTANT STABILIZED: GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

AI Assistant harus terhubung ke:

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
```

## Integrasi Ringkas

```text
Document Control → SOP, policy, procedure, controlled document sebagai RAG
Reports & Analytics → executive summary, KPI insight, trend explanation
Incident Management → RCA, investigation, lesson learned, CAPA suggestion
Risk Management → hazard/control recommendation, HIRADC/JSA draft
Permit to Work → permit risk review, missing control warning
Audit & Inspection → finding summary, audit checklist suggestion
Action Tracking → CAPA recommendation and follow-up
Legal & Compliance → obligation explanation, compliance gap
Training & Competency → training gap analysis
Environment → exceedance and spill summary
Quality → NCR/complaint/COPQ analysis
Security → security incident insight
Contractor → contractor risk/performance insight
Emergency → readiness and drill evaluation
Asset & Equipment → overdue certificate/inspection/calibration insight
```


---

# AI Assistant Sequence

```text
01 Foundation & AI Provider Configuration
02 AI Chat Workspace Core
03 AI Permission, Scope & Guardrail
04 Knowledge Base & Document RAG
05 Module Data Context Connector
06 Incident RCA & Investigation Assistant
07 Risk, HIRADC & JSA Assistant
08 Permit to Work Review Assistant
09 Audit, Inspection & CAPA Assistant
10 Legal, Compliance & Document Assistant
11 Reports, Analytics & Executive Summary Assistant
12 Prompt Template, Skill & Workflow Library
13 AI Usage Log, Token Cost, Rate Limit & Admin Control
14 QA, Security Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue AI Assistant Sequence. Kerjakan sequence berikutnya sesuai sequence/00_AI_ASSISTANT_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
AI ASSISTANT STABILIZED: GO
```
