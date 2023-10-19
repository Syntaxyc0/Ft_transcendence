#!/bin/bash
chown -R root:root /app/Frontend
chmod -R 755 /app/Frontend
npm install
npm install --legacy-peer-deps
ng serve --host 0.0.0.0