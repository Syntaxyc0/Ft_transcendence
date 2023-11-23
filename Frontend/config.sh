#!/bin/bash
chown -R root:root /app/Frontend
chmod -R 755 /app/Frontend
cd /app/Frontend
#ncu -u
npm install --force --legacy-peer-deps
ng serve --host 0.0.0.0