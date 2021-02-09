module.exports = {
  apps: [
    {
      name: 'nuxt-staging-app',
      exec_mode: 'cluster',
      instances: 2,
      script: 'nuxt-start',
      args: '--dotenv .env.staging',
      watch: true,
      out_file: '/dev/null',
      error_file: '/dev/null',
      env: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nuxt-production-app',
      exec_mode: 'cluster',
      instances: 2,
      script: 'nuxt-start',
      args: '--dotenv .env.production',
      watch: true,
      out_file: '/dev/null',
      error_file: '/dev/null',
      env: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
}
