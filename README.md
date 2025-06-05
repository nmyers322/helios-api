# Helios API

## Install local system dependencies
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
1. \. "$HOME/.nvm/nvm.sh"
1. nvm install 20
1. npm install -g pm2
1. apt update
1. apt install zip -y

## Build app on local system
1. git clone https://github.com/nmyers322/helios-api.git
1. git clone https://github.com/nmyers322/helios-secrets.git
1. cp helios-secrets/v2/react/.env helios-api/inertia/app
1. cd helios-api
1. npm install
1. npm run build
1. cp ../helios-secrets/v2/.env build
1. cp ecosystem.config.cjs build

## Install remote system dependencies
1. export SERVER_IP=your.server.ip.address
1. ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP
1. sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | sudo bash
1. sudo \. "$HOME/.nvm/nvm.sh"
1. nvm install 20
1. npm install -g pm2
1. sudo apt update
1. sudo apt install nginx zip -y
1. sudo apt install postgresql postgresql-contrib -y
1. sudo systemctl start postgresql.service

## Setup postgres on remote system
1. sudo -u postgres createuser --interactive # helios-db
1. sudo -u postgres createdb helios-db
1. sudo adduser helios-db
1. sudo -i -u postgres
1. psql
1. postgres=# \password helios-db
1. postgres=# \q
1. exit

## Setup nginx on remote system
1. scp -i ~/.ssh/helios.pem nginx.conf /home/ubuntu
1. ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP
1. sudo mv /home/ubuntu/nginx.conf /etc/nginx/sites-available/heliospressing.com.conf
1. sudo nginx -t
1. sudo systemctl restart nginx

## Run data migrations if first time
1. node ace migration:fresh

## Deploy app to remote server
1. zip -r build.zip build
1. scp -i ~/.ssh/helios.pem build.zip ubuntu@$SERVER_IP:/tmp/
1. ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP
1. sudo mkdir -p /opt/apps/helios-api
1. sudo unzip /tmp/build.zip -d /opt/apps
1. sudo rm -rf /opt/apps/helios-api;sudo mv /home/ubuntu/helios-api/build /opt/apps/helios-api;sudo chown -R www-data:www-data /opt/apps/helios-api;sudo chmod -R 755 /opt/apps/helios-api
1. rm /tmp/build.zip
1. sudo -i
1. cd /opt/apps/helios-api

## Start app
1. pm2 start ../ecosystem.config.js

## Dump/import data
1. pg_dump -U helios-db -h 127.0.0.1 helios-db > db_backup.sql
1. scp nate@heliospressing.com:/tmp/db_backup.sql ./

-- Adjust sequence IDs
-- Remove duplicate addresses

1. scp -i ~/.ssh/helios.pem db_backup.sql ubuntu@$SERVER_IP:/home/ubuntu

-- Drop the database (must disconnect all users first)
DROP DATABASE IF EXISTS "helios-db";

-- Recreate the database, owned by your user
CREATE DATABASE "helios-db" OWNER "helios-db";

-- (Optional) Grant all privileges to your user
GRANT ALL PRIVILEGES ON DATABASE "helios-db" TO "helios-db";

1. psql -U helios-db -h 127.0.0.1 helios-db < /home/ubuntu/db_backup.sql


## Deploy
npm run build
cp .env build/
cp ../helios-secrets/v2/react/.env build/inertia/app/
cp ecosystem.config.cjs build/
zip -r build.zip build
scp -i ~/.ssh/helios.pem build.zip ubuntu@$SERVER_IP:/tmp/
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP

sudo mkdir -p /opt/apps
TIMESTAMP=$(date +%Y%m%d%H%M%S)
sudo unzip /tmp/build.zip -d /opt/apps
sudo mv /opt/apps/build /opt/apps/$TIMESTAMP
sudo chown -R ubuntu:ubuntu /opt/apps/$TIMESTAMP
sudo chmod -R 755 /opt/apps/$TIMESTAMP
cd /opt/apps/$TIMESTAMP
npm ci --omit=dev
sudo ln -sfn /opt/apps/$TIMESTAMP /opt/apps/helios-api
pm2 restart helios-api
rm /tmp/build.zip