# Helios API
1. install node 20
1. clone this repo
1. cd helios-api
1. npm install
1. npm run build
1. cp .env build
1. cd build
1. npm ci --omit="dev"
1. pm2 start ../ecosystem.config.js