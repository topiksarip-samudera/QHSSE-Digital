import {
  LayoutDashboard,
  Building2,
  Network,
  Users,
  Database,
  Blocks,
  Workflow,
  Bell,
  Paperclip,
  ScrollText,
  ListChecks,
  FileInput,
  CheckSquare2,
  Hash,
  FileText,
  UploadCloud,
  Calendar,
  KeyRound,
  Webhook,
  BarChart3,
  Search,
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  HardDriveDownload,
  Activity,
  Bot,
  Wifi,
  Plug,
  Archive,
  Scale,
  FileBarChart2,
  AlertTriangle,
  ClipboardList,
  HardHat,
  FileCheck2,
  Leaf,
  GraduationCap,
  Medal,
  Building,
  Wrench,
  Flame,
  Settings,
  MapPin,
  Landmark,
  type LucideIcon,
} from 'lucide-react';

export interface NavChild {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  children?: NavChild[];
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Companies', href: '/dashboard/companies', icon: Building2 },
    ],
  },
  {
    label: 'Organization',
    items: [
      { name: 'Organization', href: '#', icon: Network, children: [
        { name: 'Sites', href: '/dashboard/organization/sites' },
        { name: 'Departments', href: '/dashboard/organization/departments' },
        { name: 'Locations', href: '/dashboard/organization/locations', icon: MapPin },
        { name: 'Positions', href: '/dashboard/organization/positions' },
      ]},
      { name: 'User Management', href: '#', icon: Users, children: [
        { name: 'Users', href: '/dashboard/users' },
        { name: 'Roles & Permissions', href: '/dashboard/roles', icon: Lock },
      ]},
      { name: 'Master Data', href: '/dashboard/master-data', icon: Database },
    ],
  },
  {
    label: 'Platform',
    items: [
      { name: 'Module Management', href: '#', icon: Blocks, children: [
        { name: 'System Modules', href: '/dashboard/module-management' },
        { name: 'Tenant Settings', href: '/dashboard/module-management/tenant' },
      ]},
      { name: 'Workflow Engine', href: '#', icon: Workflow, children: [
        { name: 'Workflow Templates', href: '/dashboard/workflow' },
        { name: 'Instances', href: '/dashboard/workflow/instances' },
        { name: 'Approval Queue', href: '/dashboard/workflow/queue' },
        { name: 'Advanced', href: '/dashboard/workflow/advanced' },
      ]},
      { name: 'Notifications', href: '#', icon: Bell, children: [
        { name: 'All Notifications', href: '/dashboard/notifications' },
        { name: 'Templates', href: '/dashboard/notifications/templates' },
        { name: 'Settings', href: '/dashboard/notifications/settings' },
      ]},
      { name: 'Attachments', href: '#', icon: Paperclip, children: [
        { name: 'All Files', href: '/dashboard/attachments' },
        { name: 'Upload', href: '/dashboard/attachments/new' },
        { name: 'Settings', href: '/dashboard/attachments/settings' },
      ]},
      { name: 'Audit Log', href: '#', icon: ScrollText, children: [
        { name: 'Activity', href: '/dashboard/audit-log' },
        { name: 'Settings', href: '/dashboard/audit-log/settings' },
      ]},
      { name: 'Action Tracking', href: '#', icon: ListChecks, children: [
        { name: 'All Actions', href: '/dashboard/action-tracking' },
        { name: 'Create', href: '/dashboard/action-tracking/new' },
        { name: 'Settings', href: '/dashboard/action-tracking/settings' },
      ]},
      { name: 'Global Search', href: '/dashboard/search', icon: Search },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { name: 'Form Builder', href: '#', icon: FileInput, children: [
        { name: 'All Forms', href: '/dashboard/form-builder' },
        { name: 'Create Form', href: '/dashboard/form-builder/new' },
        { name: 'Settings', href: '/dashboard/form-builder/settings' },
      ]},
      { name: 'Checklist Builder', href: '#', icon: CheckSquare2, children: [
        { name: 'All Checklists', href: '/dashboard/checklist-builder' },
        { name: 'Create', href: '/dashboard/checklist-builder/new' },
        { name: 'Settings', href: '/dashboard/checklist-builder/settings' },
      ]},
      { name: 'Numbering', href: '#', icon: Hash, children: [
        { name: 'Rules', href: '/dashboard/numbering' },
        { name: 'Create Rule', href: '/dashboard/numbering/new' },
        { name: 'Settings', href: '/dashboard/numbering/settings' },
      ]},
      { name: 'Templates', href: '#', icon: FileText, children: [
        { name: 'All Templates', href: '/dashboard/templates' },
        { name: 'Create', href: '/dashboard/templates/new' },
        { name: 'Categories', href: '/dashboard/templates/settings' },
      ]},
      { name: 'Import & Export', href: '#', icon: UploadCloud, children: [
        { name: 'Import', href: '/dashboard/import-export' },
        { name: 'Export', href: '/dashboard/import-export/settings' },
      ]},
      { name: 'Calendar', href: '#', icon: Calendar, children: [
        { name: 'Schedules', href: '/dashboard/calendar' },
        { name: 'Create', href: '/dashboard/calendar/new' },
        { name: 'Settings', href: '/dashboard/calendar/settings' },
      ]},
      { name: 'API Keys', href: '#', icon: KeyRound, children: [
        { name: 'All Keys', href: '/dashboard/api-keys' },
      ]},
      { name: 'Webhooks', href: '#', icon: Webhook, children: [
        { name: 'All Webhooks', href: '/dashboard/webhooks' },
        { name: 'Settings', href: '/dashboard/webhooks/settings' },
      ]},
      { name: 'Dashboard Builder', href: '#', icon: BarChart3, children: [
        { name: 'All Dashboards', href: '/dashboard/builder' },
        { name: 'Create', href: '/dashboard/builder/new' },
      ]},
    ],
  },
  {
    label: 'Security',
    items: [
      { name: 'SSO Providers', href: '#', icon: Shield, children: [
        { name: 'Providers', href: '/dashboard/sso' },
        { name: 'Add Provider', href: '/dashboard/sso/new' },
        { name: 'Settings', href: '/dashboard/sso/settings' },
      ]},
      { name: 'MFA', href: '#', icon: ShieldCheck, children: [
        { name: 'Settings', href: '/dashboard/mfa/settings' },
      ]},
      { name: 'Permissions', href: '#', icon: Lock, children: [
        { name: 'Advanced', href: '/dashboard/permissions/settings' },
      ]},
    ],
  },
  {
    label: 'Subscription',
    items: [
      { name: 'Plans & Usage', href: '#', icon: CreditCard, children: [
        { name: 'Plans & Usage', href: '/dashboard/subscription/settings' },
      ]},
      { name: 'Backup & Restore', href: '/dashboard/backup', icon: HardDriveDownload },
      { name: 'System Health', href: '/dashboard/system-health', icon: Activity },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'AI Governance', href: '/dashboard/ai-governance', icon: Bot },
      { name: 'Offline Sync', href: '/dashboard/pwa', icon: Wifi },
      { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
      { name: 'Data Retention', href: '/dashboard/data-retention', icon: Archive },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { name: 'Legal Compliance', href: '/dashboard/compliance', icon: Landmark },
      { name: 'Reports', href: '/dashboard/reporting', icon: FileBarChart2 },
      { name: 'Reports & Analytics', href: '#', icon: FileBarChart2, children: [
        { name: 'Overview', href: '/dashboard/reports' },
        { name: 'Templates', href: '/dashboard/reports/templates' },
        { name: 'Schedules', href: '/dashboard/reports/schedules' },
        { name: 'Run History', href: '/dashboard/reports/runs' },
        { name: 'Settings', href: '/dashboard/reports/settings' },
        { name: 'Dashboards', href: '/dashboard/reports/dashboards' },
      ]},
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Incident', href: '#', icon: AlertTriangle, children: [
        { name: 'Dashboard', href: '/dashboard/incident' },
        { name: 'Settings', href: '/dashboard/incident/settings' },
        { name: 'Master Data', href: '/dashboard/incident/master-data' },
      ]},
      { name: 'Risk Management', href: '#', icon: AlertTriangle, children: [
        { name: 'Dashboard', href: '/dashboard/risk' },
        { name: 'Settings', href: '/dashboard/risk/settings' },
        { name: 'Master Data', href: '/dashboard/risk/master-data' },
        { name: 'Matrix', href: '/dashboard/risk/matrix' },
        { name: 'Heatmap', href: '/dashboard/risk/heatmap' },
      ]},
      { name: 'Audit & Inspection', href: '#', icon: ClipboardList, children: [
        { name: 'Settings', href: '/dashboard/audit-inspection/settings' },
        { name: 'Master Data', href: '/dashboard/audit-inspection/master-data' },
      ]},
      { name: 'Permit to Work', href: '#', icon: HardHat, children: [
        { name: 'Dashboard', href: '/dashboard/ptw' },
        { name: 'Settings', href: '/dashboard/ptw/settings' },
        { name: 'Master Data', href: '/dashboard/ptw/master-data' },
      ]},
      { name: 'Document Control', href: '#', icon: FileCheck2, children: [
        { name: 'Settings', href: '/dashboard/document-control/settings' },
        { name: 'Master Data', href: '/dashboard/document-control/master-data' },
      ]},
      { name: 'Environment', href: '#', icon: Leaf, children: [
        { name: 'Settings', href: '/dashboard/environment/settings' },
        { name: 'Master Data', href: '/dashboard/environment/master-data' },
      ]},
      { name: 'Training', href: '#', icon: GraduationCap, children: [
        { name: 'Settings', href: '/dashboard/training/settings' },
        { name: 'Master Data', href: '/dashboard/training/master-data' },
        { name: 'Training Matrix', href: '/dashboard/training/matrices' },
        { name: 'Training Plans', href: '/dashboard/training/plans' },
        { name: 'Competency', href: '/dashboard/training/competency' },
        { name: 'Training Needs', href: '/dashboard/training/needs' },
        { name: 'Inductions', href: '/dashboard/training/inductions' },
        { name: 'Toolbox Meetings', href: '/dashboard/training/toolbox' },
        { name: 'Certificates', href: '/dashboard/training/certificates' },
      ]},
      { name: 'Quality', href: '#', icon: Medal, children: [
        { name: 'Settings', href: '/dashboard/quality/settings' },
        { name: 'Master Data', href: '/dashboard/quality/master-data' },
        { name: 'NCR', href: '/dashboard/quality/ncr' },
        { name: 'Complaints', href: '/dashboard/quality/complaints' },
        { name: 'Supplier Quality', href: '/dashboard/quality/supplier' },
        { name: 'Inspections', href: '/dashboard/quality/inspections' },
        { name: 'Punch Lists', href: '/dashboard/quality/punch-list' },
        { name: 'Defects', href: '/dashboard/quality/defects' },
        { name: 'CAPA', href: '/dashboard/quality/capa' },
        { name: 'Calibration', href: '/dashboard/quality/calibration' },
      ]},
      { name: 'Security', href: '#', icon: Shield, children: [
        { name: 'Settings', href: '/dashboard/security/settings' },
        { name: 'Master Data', href: '/dashboard/security/master-data' },
        { name: 'Incidents', href: '/dashboard/security/incidents' },
        { name: 'Visitors', href: '/dashboard/security/visitors' },
        { name: 'Gate Passes', href: '/dashboard/security/gate-passes' },
        { name: 'Badges', href: '/dashboard/security/badges' },
        { name: 'Patrol', href: '/dashboard/security/patrol' },
        { name: 'Lost & Found', href: '/dashboard/security/lost-found' },
        { name: 'Investigations', href: '/dashboard/security/investigations' },
        { name: 'Actions', href: '/dashboard/security/actions' },
      ]},
      { name: 'Contractor Mgmt', href: '#', icon: Building, children: [
        { name: 'Settings', href: '/dashboard/contractor/settings' },
        { name: 'Master Data', href: '/dashboard/contractor/master-data' },
        { name: 'Profiles', href: '/dashboard/contractor/profiles' },
        { name: 'Prequalification', href: '/dashboard/contractor/prequalification' },
        { name: 'Documents', href: '/dashboard/contractor/documents' },
        { name: 'Workers', href: '/dashboard/contractor/workers' },
        { name: 'Equipment', href: '/dashboard/contractor/equipment' },
        { name: 'Audits', href: '/dashboard/contractor/audits' },
        { name: 'Incidents', href: '/dashboard/contractor/incidents' },
        { name: 'Performance', href: '/dashboard/contractor/performance' },
        { name: 'Watchlist', href: '/dashboard/contractor/watchlist' },
      ]},
      { name: 'Asset & Equipment', href: '#', icon: Wrench, children: [
        { name: 'Settings', href: '/dashboard/asset/settings' },
        { name: 'Master Data', href: '/dashboard/asset/master-data' },
        { name: 'Asset Register', href: '/dashboard/asset/register' },
        { name: 'Maintenance', href: '/dashboard/asset/maintenance' },
        { name: 'Inspections', href: '/dashboard/asset/inspections' },
        { name: 'Certificates', href: '/dashboard/asset/certificates' },
        { name: 'Transfers', href: '/dashboard/asset/transfers' },
        { name: 'Disposal', href: '/dashboard/asset/disposal' },
      ]},
      { name: 'Legal', href: '#', icon: Scale, children: [
        { name: 'Settings', href: '/dashboard/legal/settings' },
        { name: 'Master Data', href: '/dashboard/legal/master-data' },
        { name: 'Regulations', href: '/dashboard/legal/regulations' },
        { name: 'Obligations', href: '/dashboard/legal/obligations' },
        { name: 'Assessments', href: '/dashboard/legal/assessments' },
        { name: 'Gap Analysis', href: '/dashboard/legal/gaps' },
        { name: 'Updates', href: '/dashboard/legal/updates' },
      ]},
      { name: 'Emergency Response', href: '#', icon: Flame, children: [
        { name: 'Dashboard', href: '/dashboard/emergency' },
        { name: 'Settings', href: '/dashboard/emergency/settings' },
        { name: 'Master Data', href: '/dashboard/emergency/master-data' },
        { name: 'Plans', href: '/dashboard/emergency/plans' },
        { name: 'Teams', href: '/dashboard/emergency/teams' },
        { name: 'Contacts', href: '/dashboard/emergency/contacts' },
        { name: 'Drills', href: '/dashboard/emergency/drills' },
        { name: 'Equipment', href: '/dashboard/emergency/equipment' },
        { name: 'Incidents', href: '/dashboard/emergency/incidents' },
      ]},
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Settings', href: '#', icon: Settings, children: [
        { name: 'Change Password', href: '/dashboard/settings/change-password' },
        { name: 'Active Sessions', href: '/dashboard/settings/sessions' },
      ]},
    ],
  },
];

// Flat list helper for backward compatibility
export const flatNavigation: NavItem[] = navigation.flatMap(g => g.items);
