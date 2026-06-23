import { PrismaClient, Status } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding QHSSE database...');

  // ─── Seed Permissions ───────────────────────────────────────────────────
  const modules = [
    'company',
    'organization',
    'user',
    'role',
    'authentication',
    'master-data',
    'module',
    'workflow',
    'notification',
    'attachment-evidence-basic',
    'audit-log-basic',
    'dashboard-basic',
    'action-tracking-basic',
    'form-builder',
    'checklist-builder',
    'advanced-workflow-engine',
    'numbering-format-generator',
    'template-management',
    'import-export-center',
    'calendar-schedule-engine',
    'api-key-management',
    'webhook-management',
    'dashboard-builder',
    'global-search',
    'collaboration-comment-thread',
    'sso-single-sign-on',
    'mfa-multi-factor-authentication',
    'advanced-permission',
    'subscription-billing-package-management',
    'backup-restore-ui',
    'system-health-monitoring',
    'ai-governance',
    'offline-pwa',
    'advanced-integration-center',
    'data-retention-archive-legal-hold',
    'compliance-control-center',
    'enterprise-reporting',
    'incident',
    'risk',
  ];

  const actions = ['view', 'create', 'update', 'delete', 'export'];

  for (const mod of modules) {
    for (const act of actions) {
      await prisma.permission.upsert({
        where: { module_action: { module: mod, action: act } },
        update: {},
        create: {
          module: mod,
          action: act,
          description: `${act} ${mod}`,
        },
      });
    }
  }
  console.log(`  ✅ Permissions seeded (${modules.length * actions.length})`);

  // Extra workflow permissions
  const workflowExtraActions = ['submit', 'approve', 'reject', 'close'];
  for (const act of workflowExtraActions) {
    await prisma.permission.upsert({
      where: { module_action: { module: 'workflow', action: act } },
      update: {},
      create: {
        module: 'workflow',
        action: act,
        description: `${act} workflow`,
      },
    });
  }
  console.log(`  ✅ Workflow extra permissions seeded (${workflowExtraActions.length})`);

  // ─── Seed System Roles ─────────────────────────────────────────────────
  const superAdminRole = await prisma.role.upsert({
    where: { companyId_code: { companyId: null, code: 'super_admin' } },
    update: {},
    create: {
      name: 'Super Admin',
      code: 'super_admin',
      description: 'System-wide administrator with full access',
      isSystem: true,
    },
  });

  const companyAdminRole = await prisma.role.upsert({
    where: { companyId_code: { companyId: null, code: 'company_admin' } },
    update: {},
    create: {
      name: 'Company Admin',
      code: 'company_admin',
      description: 'Company-level administrator',
      isSystem: true,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { companyId_code: { companyId: null, code: 'viewer' } },
    update: {},
    create: {
      name: 'Viewer',
      code: 'viewer',
      description: 'Read-only access',
      isSystem: true,
    },
  });

  // Assign all permissions to super_admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log('  ✅ System roles seeded');

  // ─── Seed Modules ──────────────────────────────────────────────────────
  const moduleData = [
    { name: 'Risk Management', code: 'risk-management', icon: 'shield-alert', sortOrder: 1 },
    { name: 'Incident Management', code: 'incident-management', icon: 'alert-triangle', sortOrder: 2 },
    { name: 'Audit & Inspection', code: 'audit-inspection', icon: 'clipboard-check', sortOrder: 3 },
    { name: 'Permit to Work', code: 'permit-to-work', icon: 'file-check', sortOrder: 4 },
    { name: 'Document Control', code: 'document-control', icon: 'file-text', sortOrder: 5 },
    { name: 'Training & Competency', code: 'training-competency', icon: 'graduation-cap', sortOrder: 6 },
    { name: 'Legal Compliance', code: 'legal-compliance', icon: 'scale', sortOrder: 7 },
    { name: 'Environment', code: 'environment', icon: 'leaf', sortOrder: 8 },
    { name: 'Quality', code: 'quality', icon: 'award', sortOrder: 9 },
    { name: 'Security', code: 'security', icon: 'lock', sortOrder: 10 },
    { name: 'Contractor Management', code: 'contractor-management', icon: 'users', sortOrder: 11 },
    { name: 'Action Tracking', code: 'action-tracking', icon: 'check-square', sortOrder: 12 },
    { name: 'Dashboard', code: 'dashboard', icon: 'bar-chart', sortOrder: 13 },
  ];

  for (const mod of moduleData) {
    await prisma.module.upsert({
      where: { code: mod.code },
      update: {},
      create: mod,
    });
  }
  console.log('  ✅ Modules seeded');

  // ─── Seed Module Features ──────────────────────────────────────────────
  const seededModules = await prisma.module.findMany();
  const moduleFeatureData: Record<string, string[]> = {
    'risk-management': ['risk-register', 'risk-assessment', 'risk-mitigation', 'risk-matrix'],
    'incident-management': ['incident-report', 'investigation', 'corrective-action', 'root-cause-analysis'],
    'audit-inspection': ['audit-plan', 'inspection-checklist', 'findings', 'non-conformance'],
    'permit-to-work': ['permit-request', 'permit-approval', 'permit-closure', 'gas-testing'],
    'document-control': ['document-creation', 'document-approval', 'document-review', 'version-control'],
    'training-competency': ['training-plan', 'training-attendance', 'competency-assessment', 'certification-tracking'],
    'legal-compliance': ['legal-register', 'compliance-monitoring', 'regulatory-update', 'gap-analysis'],
    'environment': ['waste-management', 'emission-monitoring', 'water-management', 'environmental-impact'],
    'quality': ['quality-plan', 'quality-inspection', 'corrective-preventive', 'quality-metrics'],
    'security': ['access-control', 'visitor-management', 'security-patrol', 'incident-reporting'],
    'contractor-management': ['contractor-registration', 'contractor-evaluation', 'work-permit', 'safety-briefing'],
    'action-tracking': ['action-creation', 'action-assignment', 'action-monitoring', 'action-closure'],
    'dashboard': ['executive-dashboard', 'safety-dashboard', 'environmental-dashboard', 'quality-dashboard'],
  };

  for (const module of seededModules) {
    const features = moduleFeatureData[module.code] || [];
    for (let i = 0; i < features.length; i++) {
      await prisma.moduleFeature.upsert({
        where: { moduleId_code: { moduleId: module.id, code: features[i] } },
        update: {},
        create: {
          moduleId: module.id,
          name: features[i].split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          code: features[i],
          isActive: true,
        },
      });
    }
  }
  console.log('  ✅ Module features seeded');

  // ─── Seed Super Admin User ─────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@qhsse.com' },
    update: {},
    create: {
      email: 'admin@qhsse.com',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      isSuperAdmin: true,
      emailVerifiedAt: new Date(),
      status: Status.active,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      timezone: 'Asia/Jakarta',
      language: 'id',
    },
  });

  // Assign super_admin role
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId_companyId_siteId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
        companyId: null,
        siteId: null,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('  ✅ Super admin user seeded (admin@qhsse.com / Admin123!)');

  // ─── Seed Sample Tenant + Company ──────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-tenant' },
    update: {},
    create: {
      name: 'Demo Tenant',
      slug: 'demo-tenant',
      status: Status.active,
    },
  });

  const company = await prisma.company.upsert({
    where: { code: 'DEMO' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Demo Company',
      code: 'DEMO',
      legalName: 'PT Demo QHSSE Indonesia',
      industry: 'Oil & Gas',
      timezone: 'Asia/Jakarta',
      language: 'id',
      status: Status.active,
      createdBy: superAdmin.id,
    },
  });

  // Assign super admin to demo company
  await prisma.userCompanyAssignment.upsert({
    where: { userId_companyId: { userId: superAdmin.id, companyId: company.id } },
    update: {},
    create: {
      userId: superAdmin.id,
      companyId: company.id,
      isPrimary: true,
    },
  });

  // Enable all modules for demo tenant
  const allModules = await prisma.module.findMany();
  for (const mod of allModules) {
    await prisma.tenantModule.upsert({
      where: { tenantId_moduleId: { tenantId: tenant.id, moduleId: mod.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        moduleId: mod.id,
        isEnabled: true,
      },
    });
  }

  // Grant super_admin full access to all modules
  for (const mod of allModules) {
    await prisma.roleModuleAccess.upsert({
      where: {
        roleId_moduleId_tenantId: {
          roleId: superAdminRole.id,
          moduleId: mod.id,
          tenantId: tenant.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        moduleId: mod.id,
        tenantId: tenant.id,
        canAccess: true,
      },
    });
  }

  console.log('  ✅ Demo tenant & company seeded');

  // ─── Seed Master Data Groups & Items ───────────────────────────────────
  const masterGroups = [
    {
      code: 'risk_level',
      name: 'Risk Level',
      description: 'Risk severity classification',
      items: [
        { name: 'Extreme', code: 'EXTREME', value: 'extreme', sortOrder: 1 },
        { name: 'High', code: 'HIGH', value: 'high', sortOrder: 2 },
        { name: 'Medium', code: 'MEDIUM', value: 'medium', sortOrder: 3 },
        { name: 'Low', code: 'LOW', value: 'low', sortOrder: 4 },
      ],
    },
    {
      code: 'incident_type',
      name: 'Incident Type',
      description: 'Types of incidents',
      items: [
        { name: 'Near Miss', code: 'NEAR_MISS', value: 'near_miss', sortOrder: 1 },
        { name: 'First Aid', code: 'FIRST_AID', value: 'first_aid', sortOrder: 2 },
        { name: 'Medical Treatment', code: 'MEDICAL', value: 'medical', sortOrder: 3 },
        { name: 'Lost Time Injury', code: 'LTI', value: 'lti', sortOrder: 4 },
        { name: 'Fatality', code: 'FATALITY', value: 'fatality', sortOrder: 5 },
      ],
    },
    {
      code: 'inspection_status',
      name: 'Inspection Status',
      description: 'Inspection workflow statuses',
      items: [
        { name: 'Scheduled', code: 'SCHEDULED', value: 'scheduled', sortOrder: 1 },
        { name: 'In Progress', code: 'IN_PROGRESS', value: 'in_progress', sortOrder: 2 },
        { name: 'Completed', code: 'COMPLETED', value: 'completed', sortOrder: 3 },
        { name: 'Overdue', code: 'OVERDUE', value: 'overdue', sortOrder: 4 },
      ],
    },
    {
      code: 'hazard_category',
      name: 'Hazard Category',
      description: 'Categories for hazard identification',
      items: [
        { name: 'Physical', code: 'PHYSICAL', value: 'physical', sortOrder: 1 },
        { name: 'Chemical', code: 'CHEMICAL', value: 'chemical', sortOrder: 2 },
        { name: 'Biological', code: 'BIOLOGICAL', value: 'biological', sortOrder: 3 },
        { name: 'Ergonomic', code: 'ERGONOMIC', value: 'ergonomic', sortOrder: 4 },
        { name: 'Psychosocial', code: 'PSYCHOSOCIAL', value: 'psychosocial', sortOrder: 5 },
      ],
    },
    {
      code: 'compliance_status',
      name: 'Compliance Status',
      description: 'Legal compliance status tracking',
      items: [
        { name: 'Compliant', code: 'COMPLIANT', value: 'compliant', sortOrder: 1 },
        { name: 'Non-Compliant', code: 'NON_COMPLIANT', value: 'non_compliant', sortOrder: 2 },
        { name: 'Pending Review', code: 'PENDING', value: 'pending', sortOrder: 3 },
        { name: 'Expired', code: 'EXPIRED', value: 'expired', sortOrder: 4 },
      ],
    },
  ];

  for (const groupData of masterGroups) {
    const group = await prisma.masterDataGroup.upsert({
      where: { companyId_code: { companyId: null, code: groupData.code } },
      update: { name: groupData.name, description: groupData.description },
      create: {
        name: groupData.name,
        code: groupData.code,
        description: groupData.description,
        isSystem: true,
      },
    });

    for (const itemData of groupData.items) {
      await prisma.masterDataItem.upsert({
        where: {
          // Use a compound check — upsert by code within group
          id: (
            await prisma.masterDataItem.findFirst({
              where: { groupId: group.id, code: itemData.code },
              select: { id: true },
            })
          )?.id || '___create___',
        },
        update: { name: itemData.name, value: itemData.value, sortOrder: itemData.sortOrder },
        create: {
          groupId: group.id,
          name: itemData.name,
          code: itemData.code,
          value: itemData.value,
          sortOrder: itemData.sortOrder,
        },
      });
    }
  }

  console.log(`  ✅ Master data seeded (${masterGroups.length} groups, ${masterGroups.reduce((s, g) => s + g.items.length, 0)} items)`);
  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
