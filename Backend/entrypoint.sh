#!/bin/bash

chown -R root:root /app/Backend
chmod -R 755 /app/Backend
cd /app/Backend
npm install
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev --name first-migration --schema='./prisma/schema.prisma' --preview-feature

exec "$@"