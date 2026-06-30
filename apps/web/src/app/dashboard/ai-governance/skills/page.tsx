'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

const SKILLS = [
  { key: 'incident-rca', name: 'Incident RCA', desc: 'Root cause analysis for incidents', icon: '🔍' },
  { key: 'risk-assessment', name: 'Risk Assessment', desc: 'Generate risk assessment reports', icon: '⚠️' },
  { key: 'permit-review', name: 'Permit Review', desc: 'Review work permit details', icon: '📋' },
  { key: 'audit-finding', name: 'Audit Finding', desc: 'Summarize audit findings', icon: '📝' },
  { key: 'compliance-gap', name: 'Compliance Gap', desc: 'Identify compliance gaps', icon: '📏' },
  { key: 'report-summary', name: 'Report Summary', desc: 'Generate executive summaries', icon: '📊' },
];

export default function AISkillsPage() {
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, string | null>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleStart = async (skillKey: string) => {
    const prompt = prompts[skillKey]?.trim();
    if (!prompt) return;
    setLoading((p) => ({ ...p, [skillKey]: true }));
    setErrors((p) => ({ ...p, [skillKey]: null }));
    setResults((p) => ({ ...p, [skillKey]: null }));
    try {
      const res = await apiClient.post(`/ai/skills/${skillKey}`, { prompt });
      setResults((p) => ({ ...p, [skillKey]: res.data.data?.conversationId || res.data.data?.id }));
    } catch (e: any) {
      setErrors((p) => ({ ...p, [skillKey]: e?.response?.data?.message || 'Request failed' }));
    } finally {
      setLoading((p) => ({ ...p, [skillKey]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Skills</h1>
        <p className="text-sm text-gray-500 mt-1">Start an AI-assisted analysis with pre-configured skills</p>
      </div>

      {SKILLS.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-3xl mb-2">🤖</div>
          <p className="text-gray-500">No skills available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((skill) => (
            <div key={skill.key} className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{skill.name}</h3>
                  <p className="text-xs text-gray-500">{skill.desc}</p>
                </div>
              </div>
              <input
                type="text"
                value={prompts[skill.key] || ''}
                onChange={(e) => setPrompts((p) => ({ ...p, [skill.key]: e.target.value }))}
                placeholder={`Enter prompt for ${skill.name}...`}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                onKeyDown={(e) => { if (e.key === 'Enter') handleStart(skill.key); }}
              />
              <div className="flex items-center justify-between mt-auto">
                <button
                  onClick={() => handleStart(skill.key)}
                  disabled={!prompts[skill.key]?.trim() || loading[skill.key]}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading[skill.key] ? 'Processing...' : 'Start'}
                </button>
                {results[skill.key] && (
                  <Link
                    href={`/dashboard/ai-governance/chat?conversation=${results[skill.key]}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View conversation →
                  </Link>
                )}
              </div>
              {errors[skill.key] && (
                <p className="text-xs text-red-500 mt-2">{errors[skill.key]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
