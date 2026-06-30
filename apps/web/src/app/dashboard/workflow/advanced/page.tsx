'use client';

import { useState, useEffect } from 'react';
import { advancedWorkflowApi } from '@/lib/api';
import Link from 'next/link';

export default function AdvancedWorkflowPage() {
  const [tab, setTab] = useState<'conditions' | 'escalations' | 'delegations' | 'sla' | 'simulate'>('simulate');
  const [workflowId, setWorkflowId] = useState('');
  const [simulateResult, setSimulateResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [delegations, setDelegations] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [slaRules, setSlaRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulate = async () => {
    if (!workflowId.trim()) return;
    setSimulating(true);
    try {
      const res = await advancedWorkflowApi.simulate(workflowId, {});
      setSimulateResult(res.data);
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSimulating(false); }
  };

  const loadDelegations = async () => {
    setLoading(true);
    try { const res = await advancedWorkflowApi.getDelegations(); setDelegations(res.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadEscalations = async () => {
    if (!workflowId.trim()) return;
    setLoading(true);
    try { const res = await advancedWorkflowApi.getEscalations(workflowId); setEscalations(res.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadSlaRules = async () => {
    if (!workflowId.trim()) return;
    setLoading(true);
    try { const res = await advancedWorkflowApi.getSlaRules(workflowId); setSlaRules(res.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if (tab === 'delegations') loadDelegations(); if (tab === 'escalations' && workflowId) loadEscalations(); if (tab === 'sla' && workflowId) loadSlaRules(); }, [tab, workflowId]);

  const tabs = [
    { key: 'simulate' as const, label: 'Simulation' },
    { key: 'delegations' as const, label: 'Delegations' },
    { key: 'escalations' as const, label: 'Escalations' },
    { key: 'sla' as const, label: 'SLA Rules' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Advanced Workflow Engine</h1><p className="text-muted-foreground mt-1">Conditional approval, parallel steps, escalation, delegation, and SLA</p></div>

      <div className="flex gap-3 items-center">
        <input type="text" value={workflowId} onChange={(e) => setWorkflowId(e.target.value)} placeholder="Workflow ID" className="px-3 py-2 border rounded-lg text-sm w-64 font-mono" />
      </div>

      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-blue-600 text-primary' : 'border-transparent text-muted-foreground/80 hover:text-foreground/80'}`}>{t.label}</button>
        ))}
      </div>

      {error && <div className="p-3 bg-destructive/10 border border-border rounded-lg text-sm text-destructive">{error}</div>}

      {tab === 'simulate' && (
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Workflow Simulation</h2>
          <p className="text-sm text-muted-foreground/80 mb-4">Enter a workflow ID to simulate its execution flow and see which steps would be active.</p>
          <div className="flex gap-3 mb-4">
            <button onClick={handleSimulate} disabled={simulating} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm">{simulating ? 'Simulating...' : 'Run Simulation'}</button>
          </div>
          {simulateResult && (
            <div className="border rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">{simulateResult.workflowName} — {simulateResult.activeSteps}/{simulateResult.totalSteps} active steps</p>
              <div className="space-y-2">
                {simulateResult.steps?.map((s: any, i: number) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded text-sm ${s.active ? 'bg-success/10' : 'bg-muted opacity-50'}`}>
                    <span className="font-medium text-foreground/80 w-24">{s.stepName}</span>
                    <span className="text-muted-foreground/60">Order {s.stepOrder}</span>
                    <span className="text-muted-foreground/80">{s.assigneeType}:{s.assigneeValue}</span>
                    {s.slaHours && <span className="text-xs text-muted-foreground/60">SLA: {s.slaHours}h</span>}
                    {!s.active && <span className="text-xs text-destructive/80">(inactive — condition not met)</span>}
                    {s.parallelGroups?.length > 0 && <span className="text-xs text-blue-500">Parallel: {s.parallelGroups.length} group(s)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'delegations' && (
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Active Delegations</h2>
          {delegations.length === 0 ? <p className="text-sm text-muted-foreground/60">No active delegations</p> : (
            <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">From</th><th className="text-left py-2">To</th><th className="text-left py-2">Workflow</th><th className="text-left py-2">Expires</th></tr></thead><tbody>{delegations.map((d: any) => (<tr key={d.id}><td className="py-1">{d.delegator?.email}</td><td className="py-1">{d.delegate?.email}</td><td className="py-1">{d.workflow?.name}</td><td className="py-1">{new Date(d.endDate).toLocaleDateString()}</td></tr>))}</tbody></table>
          )}
        </div>
      )}

      {tab === 'escalations' && (
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Escalation Rules</h2>
          {escalations.length === 0 ? <p className="text-sm text-muted-foreground/60">No escalation rules configured</p> : (
            <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Step</th><th className="text-left py-2">After</th><th className="text-left py-2">Escalate To</th><th className="text-left py-2">Max</th></tr></thead><tbody>{escalations.map((e: any) => (<tr key={e.id}><td className="py-1">{e.step?.name}</td><td className="py-1">{e.escalateAfterHr}h</td><td className="py-1">{e.escalateToRole || e.escalateToUser || '-'}</td><td className="py-1">{e.maxEscalations}</td></tr>))}</tbody></table>
          )}
        </div>
      )}

      {tab === 'sla' && (
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">SLA Rules</h2>
          {slaRules.length === 0 ? <p className="text-sm text-muted-foreground/60">No SLA rules configured</p> : (
            <table className="min-w-full text-sm"><thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">SLA</th><th className="text-left py-2">Priority</th><th className="text-left py-2">Warn At</th></tr></thead><tbody>{slaRules.map((r: any) => (<tr key={r.id}><td className="py-1">{r.name}</td><td className="py-1">{r.slaHours}h</td><td className="py-1">{r.priority}</td><td className="py-1">{r.warnAtHour ? `${r.warnAtHour}h` : '-'}</td></tr>))}</tbody></table>
          )}
        </div>
      )}
    </div>
  );
}
