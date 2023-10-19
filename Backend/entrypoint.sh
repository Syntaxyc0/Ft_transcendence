#!/bin/bash

npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev --name first-migration --schema='./prisma/schema.prisma' --preview-feature

exec "$@"