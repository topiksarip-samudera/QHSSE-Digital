'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { moduleManagementApi, ModuleData } from '@/lib/api';

interface TenantModuleItem extends ModuleData {
  isEnabled: boolean;
  config?: any;
  features: (ModuleData['features'] extends (infer U)[] | undefined ? U : never)[] & { isEnabled?: boolean }[];
}

export default function TenantModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Get tenant ID from user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // User might have tenantId directly or through company assignments
        if (user.tenantId) {
          setTenantId(user.tenantId);
        } else if (user.companyAssignments?.[0]?.company?.tenantId) {
          setTenantId(user.companyAssignments[0].company.tenantId);
        }
      } catch {}
    }
  }, []);

  const fetchModules = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await moduleManagementApi.getTenantModules(tenantId);
      setModules(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) fetchModules();
  }, [tenantId]);

  const handleToggleModule = async (moduleId: string, currentState: boolean) => {
    if (!tenantId) return;
    setUpdating(moduleId);
    try {
      await moduleManagementApi.toggleTenantModule(tenantId, moduleId, !currentState);
      fetchModules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle module');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleFeature = async (featureId: string, currentState: boolean) => {
    if (!tenantId) return;
    setUpdating(featureId);
    try {
      await moduleManagementApi.toggleTenantFeature(tenantId, featureId, !currentState);
      fetchModules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle feature');
    } finally {
      setUpdating(null);
    }
  };

  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Unable to determine tenant. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tenant Module Settings</h1>
        <p className="text-muted-foreground">
          Enable or disable modules and features for your organization
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`rounded-lg border bg-card transition-all ${
                !mod.isEnabled ? 'opacity-60' : ''
              }`}
            >
              {/* Module Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mod.icon ? getIcon(mod.icon) : '📦'}</span>
                  <div>
                    <h3 className="font-semibold">{mod.name}</h3>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleModule(mod.id, mod.isEnabled)}
                  disabled={updating === mod.id}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    mod.isEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  } ${updating === mod.id ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      mod.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Features (expandable) */}
              {mod.isEnabled && mod.features && mod.features.length > 0 && (
                <div className="border-t px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                    Sub-Features
                  </p>
                  <div className="space-y-2">
                    {mod.features.map((feature: any) => (
                      <div key={feature.id} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/30">
                        <div>
                          <span className="text-sm">{feature.name}</span>
                          {feature.description && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              — {feature.description}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleFeature(feature.id, feature.isEnabled ?? true)}
                          disabled={updating === feature.id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            feature.isEnabled !== false ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          } ${updating === feature.id ? 'opacity-50' : ''}`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              feature.isEnabled !== false ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    'shield-alert': '🛡️', 'alert-triangle': '⚠️', 'clipboard-check': '📋',
    'file-check': '✅', 'file-text': '📄', 'graduation-cap': '🎓',
    'scale': '⚖️', 'leaf': '🌿', 'award': '🏆',
    'lock': '🔒', 'users': '👥', 'check-square': '✅', 'bar-chart': '📊',
  };
  return iconMap[icon] || '📦';
}
