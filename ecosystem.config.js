module.exports = {
  apps: [
    {
      name: 'qhsse-api',
      cwd: '/home/ubuntu/workspace/QHSSE-Digital/qhsse-platform/apps/api',
      script: 'pnpm',
      args: 'dev',
      node_args: '--max-old-space-size=4096',
      env: { PORT: '4000' },
      max_restarts: 5,
      restart_delay: 10000,    },
    {
      name: 'qhsse-web',
      cwd: '/home/ubuntu/workspace/QHSSE-Digital/qhsse-platform/apps/web',
      script: 'pnpm',
      args: 'dev',
      node_args: '--max-old-space-size=4096',
      env: { PORT: '3000' },
      max_restarts: 5,
      restart_delay: 10000,    },
  ],
};
