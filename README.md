# Helios API
1. # install node 20
1. npm install -g pm2
1. # clone this repo
1. cd helios-api
1. npm install
1. npm run build
1. cp .env build # located in helios-secrets/v2
1. cd build
1. npm ci --omit="dev"
1. pm2 start ../ecosystem.config.js
1. apt update
1. apt install postgresql postgresql-contrib -y
1. systemctl start postgresql.service
1. sudo -u postgres createuser --interactive # helios-db
1. sudo -u postgres createdb helios-db
1. sudo adduser helios-db
1. sudo -i -u postgres
1. psql
1. postgres=# \password helios-db
1. postgres=# \q
1. node ace migration:fresh
1. node ace db:seed