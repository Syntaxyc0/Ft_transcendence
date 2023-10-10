#!/bin/sh


cd Backend && npm run db:dev:restart &
cd Backend && npm run start:dev