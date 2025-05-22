module.exports = {
  apps: [
    {
      name: 'helios-api',
      script: './bin/server.js', 
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true
    },
  ],
}