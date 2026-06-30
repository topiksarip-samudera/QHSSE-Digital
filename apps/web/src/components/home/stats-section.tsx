export default function StatsSection() {
  const stats = [
    { value: '50+', label: 'Modules', description: 'Comprehensive coverage' },
    { value: '99.9%', label: 'Uptime', description: 'Reliable & secure', color: 'emerald' },
    { value: '24/7', label: 'Support', description: 'Always available', color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
  };

  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`mb-2 text-4xl font-bold ${colorMap[stat.color || 'primary']}`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
