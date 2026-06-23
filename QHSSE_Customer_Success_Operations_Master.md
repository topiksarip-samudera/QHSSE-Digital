# START HERE — QHSSE Customer Success & Operations Generating Pack

Paket ini dibuat untuk generate tahap **Customer Success & Operations** pada WebApp/SaaS QHSSE setelah public launch.

## Rekomendasi Split

Customer Success & Operations sebaiknya di-split menjadi **10 sequence**.

```text
01 Customer Success Strategy & Operating Model
02 Customer Onboarding Monitoring & Activation
03 Support Desk, SLA & Escalation Operations
04 Customer Health Score & Adoption Tracking
05 Usage Analytics & Product Adoption Insight
06 Renewal Management & Churn Prevention
07 Training, Enablement & Knowledge Base Operations
08 Voice of Customer, Feature Request & Roadmap Feedback
09 Account Management, QBR & Customer Communication
10 Operations Dashboard, QA & Continuous Improvement
```

## Kenapa 10 Sequence?

Tahap ini bukan lagi membangun fitur utama, tetapi menjaga customer tetap aktif, puas, terbantu, renew, dan berkembang.

Fokus utama:

```text
Customer success strategy
Customer lifecycle
Onboarding monitoring
Activation milestone
Support desk operation
SLA and escalation
Customer health score
Adoption tracking
Usage analytics
Renewal management
Churn prevention
Training and enablement
Knowledge base operations
Voice of Customer
Feature request management
Roadmap feedback
Account management
QBR
Customer communication
Operations dashboard
Continuous improvement
```

## Platform yang Dioperasikan

```text
Core Platform
Stabilization & QA
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
AI Assistant
Mobile/PWA Field Optimization
SaaS Commercialization
Production Hardening & Go-Live Preparation
Beta Testing & Pilot Customer Program
Commercial Launch Preparation
Public Launch Execution
```

## Cara Pakai

1. Extract ZIP.
2. Baca `00_PROMPT_AWAL_CUSTOMER_SUCCESS_OPERATIONS.md`.
3. Baca `01_CUSTOMER_SUCCESS_OPERATIONS_MASTER_BLUEPRINT.md`.
4. Baca `02_CUSTOMER_SUCCESS_OPERATIONS_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_customer_success_strategy_operating_model.md`.
6. Kerjakan satu sequence saja.
7. Setelah selesai tulis status sequence.
8. Jangan lanjut sebelum diminta continue.

## Status Akhir

```text
CUSTOMER SUCCESS OPERATIONS STABILIZED: GO
```


---

# 00 — PROMPT AWAL CUSTOMER SUCCESS & OPERATIONS UNTUK AI AGENT

Core Platform, seluruh QHSSE Operational Modules, Reports & Analytics, AI Assistant, Mobile/PWA Field Optimization, SaaS Commercialization, Production Hardening & Go-Live Preparation, Beta Testing & Pilot Customer Program, Commercial Launch Preparation, dan Public Launch Execution sudah selesai atau siap integrasi.

Platform yang sekarang harus dioperasikan untuk customer real:

```text
Core Platform
Stabilization & QA
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
AI Assistant
Mobile/PWA Field Optimization
SaaS Commercialization
Production Hardening & Go-Live Preparation
Beta Testing & Pilot Customer Program
Commercial Launch Preparation
Public Launch Execution
```

Sekarang generate tahap **Customer Success & Operations** berdasarkan folder `qhsse_customer_success_operations_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_customer_success_strategy_operating_model.md`.
3. Tahap ini tidak boleh hanya membuat checklist support umum.
4. Harus menghasilkan operating model, lifecycle, onboarding monitoring, support workflow, SLA, escalation, health score, adoption tracking, usage analytics, renewal workflow, churn prevention, training operations, knowledge base process, VoC, feature request, QBR, operations dashboard, dan continuous improvement backlog.
5. Harus mencakup customer lifecycle dari onboarding sampai renewal.
6. Harus mencakup customer health score dan churn risk.
7. Harus mencakup support SLA dan escalation.
8. Harus mencakup adoption tracking per module, AI, mobile, reports, dan user activity.
9. Harus mencakup renewal management dan retention playbook.
10. Harus mencakup feature request management dan roadmap feedback.
11. Harus mencakup account management dan QBR.
12. Harus menghasilkan operations dashboard dan release gate.
13. Semua output harus bisa dipakai oleh AI agent untuk membuat halaman, dokumen, board, template, dashboard, dan workflow.
14. Setelah sequence selesai, tulis:
   `SELESAI CUSTOMER SUCCESS OPERATIONS SEQUENCE XX: <nama sequence>`
15. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT CUSTOMER SUCCESS & OPERATIONS

## Tujuan

Tahap **Customer Success & Operations** bertujuan menjaga customer setelah public launch agar mereka berhasil menggunakan platform, aktif mengadopsi modul, mendapat support yang baik, memberikan feedback, memperpanjang subscription, dan berkembang menjadi customer jangka panjang.

Tahap ini adalah mesin operasional pasca-launch.

## Prinsip Desain

1. Customer Success bukan hanya support ticket.
2. Customer harus dipantau sejak onboarding sampai renewal.
3. Adoption harus diukur dengan data usage, bukan asumsi.
4. Health score harus mendeteksi risiko churn lebih awal.
5. Support harus punya SLA dan escalation.
6. Training dan enablement harus role-based.
7. Feedback customer harus masuk roadmap secara terstruktur.
8. Renewal harus dikelola sebelum masa kontrak habis.
9. QBR harus menampilkan value yang sudah diterima customer.
10. Continuous improvement harus berbasis data, support ticket, feedback, dan usage analytics.

## Customer Lifecycle

```text
Lead Converted
New Customer
Onboarding
Activation
Adoption
Value Realization
Expansion
Renewal
Advocacy
At Risk
Churned
Winback
```

## Target Output

```text
Customer Success Operating Model
Customer Lifecycle Map
Customer Segment Strategy
Onboarding Monitoring Board
Activation Milestone Tracker
Support Desk Workflow
SLA Matrix
Escalation Matrix
Support Macro Template
Customer Health Score Model
Adoption Tracking Dashboard
Usage Analytics Dashboard
Churn Risk Model
Renewal Management Workflow
Retention Playbook
Training Operations Plan
Knowledge Base Operations
Voice of Customer Workflow
Feature Request Intake
Roadmap Feedback Process
Account Management Playbook
QBR Template
Customer Communication Calendar
Customer Operations Dashboard
Continuous Improvement Backlog
Operations Release Gate
```

## Customer Segmentation

```text
Trial
SMB
Professional
Enterprise
Strategic Account
High Risk
High Growth
Partner / Reseller Managed
```

## CS KPI

```text
Onboarding completion rate
Time to first value
Activation rate
Monthly active users
Module adoption rate
Mobile usage rate
AI usage rate
Report usage rate
Support ticket volume
SLA compliance
Customer health score
Renewal rate
Churn rate
Expansion revenue
NPS / CSAT
Feature request closure rate
```


---

# 02 — CUSTOMER SUCCESS & OPERATIONS GENERATING RULES

## Aturan Utama

1. Jangan membuat CS hanya sebagai support ticket.
2. Semua customer lifecycle harus punya status dan owner.
3. Onboarding harus punya milestone dan due date.
4. Activation harus diukur dari aktivitas nyata.
5. Support ticket harus punya priority dan SLA.
6. Escalation harus jelas untuk P0/P1.
7. Health score harus dihitung dari beberapa komponen.
8. Churn risk harus punya trigger dan mitigation.
9. Renewal harus dimulai jauh sebelum subscription berakhir.
10. Training harus role-based.
11. Knowledge base harus diperbarui dari ticket dan feedback.
12. Feature request harus diprioritaskan, tidak langsung dijanjikan.
13. QBR harus berbasis usage, value, issue, dan next plan.
14. Operations dashboard harus menampilkan KPI yang actionable.
15. Semua keputusan penting harus audit-friendly.

## Priority Support

```text
P0 = production down / critical business blocker / data security issue
P1 = major workflow blocker / no workaround
P2 = important issue with workaround
P3 = minor bug / usability issue
P4 = question / request / enhancement
```

## Customer Health Score Components

```text
Usage score
Adoption score
Support score
Training score
Renewal score
Engagement score
Payment/billing score
Product fit score
```

## Risk Level

```text
Healthy
Watch
At Risk
Critical
Churned
```


---

# 03 — CUSTOMER SUCCESS OPERATING MODEL GUIDE

## Team Roles

```text
Customer Success Manager
Support Agent
Technical Support
Implementation Specialist
Product Owner
Engineering Escalation Owner
Account Manager
Renewal Manager
Training Specialist
```

## Responsibility Matrix

```text
CSM → adoption, health, QBR, renewal risk
Support → ticket handling and SLA
Technical Support → technical troubleshooting
Product Owner → roadmap and feature request review
Engineering → bug fix and escalation
Account Manager → commercial follow-up and expansion
Training Specialist → enablement and role-based training
```

## Operating Cadence

```text
Daily: support triage and P0/P1 review
Weekly: health score and adoption review
Bi-weekly: feedback and roadmap review
Monthly: customer success report
Quarterly: QBR and renewal pipeline review
```

## Customer Lifecycle Status

```text
Onboarding
Active
Adopting
Expanding
At Risk
Renewal Due
Renewed
Churned
Winback
```


---

# 04 — ONBOARDING & ADOPTION GUIDE

## Onboarding Milestones

```text
Tenant created
Admin invited
Company profile completed
Sites/projects created
Roles configured
Users invited
Modules enabled
Master data uploaded
First workflow completed
First mobile submission
First report viewed
First AI assistant usage
Training completed
Go-live confirmed
```

## Activation Metrics

```text
Admin login
User invite accepted
First incident created
First inspection completed
First permit approved
First document published
First report exported
First mobile evidence captured
First AI question asked
```

## Adoption Levels

```text
Low Adoption: setup incomplete or few users active
Medium Adoption: several workflows used
High Adoption: core modules and reports used consistently
Advanced Adoption: AI, mobile, reports, and cross-module workflows used
```


---

# 05 — SUPPORT, SLA & ESCALATION GUIDE

## Ticket Categories

```text
Bug
How-to Question
Access / Permission
Billing
Training Request
Integration
Performance
Mobile/PWA
AI Assistant
Report Issue
Feature Request
Security Concern
```

## SLA Matrix

```text
P0 Critical: response 1–2 hours, update every 2 hours
P1 High: response 4–8 business hours, update daily
P2 Medium: response 1 business day, update every 2–3 days
P3 Low: response 3 business days
P4 Request: response 5 business days
```

## Escalation Path

```text
Support Agent
Technical Support
Engineering Lead
Product Owner
Customer Success Manager
Management Escalation
```

## Support Macro Examples

```text
Acknowledgement
Need more information
Workaround provided
Issue escalated
Fix scheduled
Issue resolved
Feature request accepted for review
Feature request added to roadmap consideration
```


---

# 06 — HEALTH SCORE & USAGE ANALYTICS GUIDE

## Health Score Formula Example

```text
Health Score = 
Usage Score 30%
Adoption Score 25%
Support Score 15%
Training Score 10%
Renewal Score 10%
Engagement Score 10%
```

## Usage Metrics

```text
Monthly active users
Weekly active users
Login frequency
Module usage
Workflow completion
Mobile submission count
AI assistant usage
Report/dashboard views
Export count
Support ticket count
Overdue action count
```

## Churn Risk Signals

```text
No login for 14+ days
Admin inactive
No core workflow completed
Support P0/P1 unresolved
Payment past due
Low training completion
Low report usage
Negative feedback
No QBR attendance
Renewal date near with low usage
```


---

# 07 — RENEWAL & CHURN PREVENTION GUIDE

## Renewal Timeline

```text
120 days before renewal: account health review
90 days before renewal: QBR and value review
60 days before renewal: renewal proposal
30 days before renewal: commercial confirmation
14 days before renewal: final reminder
0 day: renewal / expiration handling
```

## Churn Prevention Playbook

```text
Identify risk
Confirm reason
Assign owner
Create save plan
Schedule customer call
Offer training/support
Resolve blockers
Show value report
Propose better plan if needed
Track outcome
```

## Retention Actions

```text
Additional training
Workflow optimization
Executive review
Support escalation
Plan adjustment
Feature workaround
Implementation assistance
Success milestone reset
```


---

# 08 — VOICE OF CUSTOMER & ROADMAP FEEDBACK GUIDE

## Feedback Intake

```text
Support ticket
QBR
Survey
User interview
Sales feedback
Implementation feedback
Churn reason
Feature request form
```

## Feature Request Fields

```text
Customer
Role
Module
Problem
Requested feature
Business impact
Frequency
Workaround
Priority
Revenue impact
Strategic value
Decision
Status
```

## Prioritization

```text
Customer impact
Revenue impact
Strategic fit
Frequency
Implementation effort
Security/compliance requirement
Enterprise demand
```

## Roadmap Status

```text
New
Under Review
Accepted
Planned
In Progress
Released
Rejected
Future Consideration
```


---

# 09 — OPERATIONS DASHBOARD GUIDE

## Customer Success Dashboard

```text
Total customers
Active customers
At-risk customers
Onboarding customers
Renewal due
Churned customers
Expansion opportunities
Average health score
```

## Support Dashboard

```text
Open tickets
P0/P1 tickets
SLA compliance
Average first response time
Average resolution time
Ticket by category
Escalated tickets
Recurring issue
```

## Adoption Dashboard

```text
MAU
WAU
Module adoption
Mobile adoption
AI adoption
Reports adoption
Inactive users
Workflow completion
```

## Renewal Dashboard

```text
Renewal pipeline
Renewal due 120/90/60/30 days
Renewed revenue
At-risk renewal
Churn reason
Expansion opportunity
```


---

# Customer Success & Operations Sequence

```text
01 Customer Success Strategy & Operating Model
02 Customer Onboarding Monitoring & Activation
03 Support Desk, SLA & Escalation Operations
04 Customer Health Score & Adoption Tracking
05 Usage Analytics & Product Adoption Insight
06 Renewal Management & Churn Prevention
07 Training, Enablement & Knowledge Base Operations
08 Voice of Customer, Feature Request & Roadmap Feedback
09 Account Management, QBR & Customer Communication
10 Operations Dashboard, QA & Continuous Improvement
```

## Prompt Continue

```text
Continue Customer Success & Operations Sequence. Kerjakan sequence berikutnya sesuai sequence/00_CUSTOMER_SUCCESS_OPERATIONS_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
CUSTOMER SUCCESS OPERATIONS STABILIZED: GO
```
