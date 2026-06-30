import { Shield, CheckCircle, FileCheck, AlertTriangle, Users, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Compliance Management',
    description: 'Track and maintain compliance with regulatory requirements and industry standards.',
    color: 'primary',
  },
  {
    icon: CheckCircle,
    title: 'Action Tracking',
    description: 'Monitor corrective and preventive actions with automated workflows and reminders.',
    color: 'emerald',
  },
  {
    icon: FileCheck,
    title: 'Document Control',
    description: 'Centralized document management with version control and approval workflows.',
    color: 'blue',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Management',
    description: 'Report, investigate, and analyze incidents to prevent future occurrences.',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Training Management',
    description: 'Schedule and track employee training programs and certifications.',
    color: 'purple',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Generate comprehensive reports and gain insights from your QHSSE data.',
    color: 'indigo',
  },
];

const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  blue: 'bg-blue-500/10 text-blue-600',
  orange: 'bg-orange-500/10 text-orange-600',
  purple: 'bg-purple-500/10 text-purple-600',
  indigo: 'bg-indigo-500/10 text-indigo-600',
};

export default function FeatureGrid() {
  return (
    <section className="border-t border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
            Everything You Need
          </h2>
          <p className="text-base text-muted-foreground">
            Powerful features to manage your QHSSE processes efficiently
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
              >
                <div className={`mb-4 flex size-12 items-center justify-center rounded-lg ${colorMap[feature.color]}`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
