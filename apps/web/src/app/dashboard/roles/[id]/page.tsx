'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { rolesApi, permissionsApi } from '@/lib/api';

interface Permission {
  id: string;
  module: string;
  action: string;
  description?: string;
}

interface RoleData {
  id: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  companyId?: string;
  status: string;
  permissions: { permission: Permission }[];
  userRoles: any[];
  _count: { permissions: number; userRoles: number };
  createdAt: string;
  updatedAt?: string;
}

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [role, setRole] = useState<RoleData | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadRole();
    loadPermissions();
  }, [id]);

  const loadRole = async () => {
    setLoading(true);
    try {
      const res = await rolesApi.get(id);
      const data = res.data.data;
      setRole(data);
      setSelectedPerms(new Set(data.permissions?.map((p: any) => p.permission?.id || p.id) || []));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load role');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const res = await permissionsApi.list();
      setAllPermissions(res.data.data || []);
    } catch {}
  };

  const togglePermission = (permId: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  };

  const toggleModule = (modulePerms: Permission[]) => {
    const allSelected = modulePerms.every((p) => selectedPerms.has(p.id));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      modulePerms.forEach((p) => {
        if (allSelected) next.delete(p.id);
        else next.add(p.id);
      });
      return next;
    });
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      await rolesApi.setPermissions(id, Array.from(selectedPerms));
      setEditMode(false);
      loadRole();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await rolesApi.delete(id);
      router.push('/dashboard/roles');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  allPermissions.forEach((p) => {
    if (!permissionsByModule[p.module]) permissionsByModule[p.module] = [];
    permissionsByModule[p.module].push(p);
  });

  const moduleNames: Record<string, string> = {
    company: 'Company',
    organization: 'Organization',
    user: 'User Management',
    role: 'Roles & Permissions',
    authentication: 'Authentication',
    'master-data': 'Master Data',
    module: 'Modules',
    workflow: 'Workflow',
    notification: 'Notifications',
    attachment: 'Attachments',
    'audit-log': 'Audit Log',
    dashboard: 'Dashboard',
    action: 'Action Tracking',
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!role) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard/roles" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Roles
          </Link>
          <h1 className="text-2xl font-bold">{role.name}</h1>
          <p className="text-sm text-muted-foreground">{role.description || 'No description'}</p>
        </div>
        <div className="flex gap-2">
          {!role.isSystem && (
            <>
              <Link
                href={`/dashboard/roles/${id}/edit`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Role Info */}
      <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Code</dt>
            <dd className="mt-1"><code className="rounded bg-muted px-1.5 py-0.5 text-sm">{role.code}</code></dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Type</dt>
            <dd className="mt-1">
              {role.isSystem ? (
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">System</span>
              ) : (
                <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">Custom</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>{role.status}</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Assigned Users</dt>
            <dd className="mt-1 text-sm">{role._count?.userRoles ?? 0}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Permissions</dt>
            <dd className="mt-1 text-sm">{role._count?.permissions ?? 0}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created</dt>
            <dd className="mt-1 text-sm">{role.createdAt ? new Date(role.createdAt).toLocaleString() : '—'}</dd>
          </div>
        </dl>
      </div>

      {/* Assigned Users */}
      {role.userRoles && role.userRoles.length > 0 && (
        <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Assigned Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Site</th>
                </tr>
              </thead>
              <tbody>
                {role.userRoles.map((ur: any) => (
                  <tr key={ur.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{ur.user?.firstName} {ur.user?.lastName}</td>
                    <td className="px-4 py-2 text-muted-foreground">{ur.user?.email}</td>
                    <td className="px-4 py-2">{ur.companyId || 'Global'}</td>
                    <td className="px-4 py-2">{ur.siteId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Matrix */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Permissions</h2>
          {!role.isSystem && (
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => { setEditMode(false); setSelectedPerms(new Set(role.permissions?.map((p: any) => p.permission?.id || p.id) || [])); }}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePermissions}
                    disabled={saving}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Permissions'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Edit Permissions
                </button>
              )}
            </div>
          )}
        </div>

        {Object.keys(permissionsByModule).length === 0 ? (
          <p className="text-sm text-muted-foreground">No permissions loaded</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(permissionsByModule).map(([module, perms]) => {
              const allSelected = perms.every((p) => selectedPerms.has(p.id));
              const someSelected = perms.some((p) => selectedPerms.has(p.id));
              return (
                <div key={module} className="rounded-md border p-4">
                  <div className="mb-2 flex items-center gap-3">
                    {editMode && (
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                        onChange={() => toggleModule(perms)}
                        className="h-4 w-4 rounded"
                      />
                    )}
                    <h3 className="text-sm font-semibold">{moduleNames[module] || module}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {perms.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2">
                        {editMode ? (
                          <input
                            type="checkbox"
                            checked={selectedPerms.has(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            className="h-4 w-4 rounded"
                          />
                        ) : (
                          <span className={`inline-block h-2 w-2 rounded-full ${selectedPerms.has(perm.id) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        )}
                        <span className="text-sm">{perm.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
