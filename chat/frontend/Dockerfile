FROM node:19 AS development

WORKDIR /chat/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@12.0.0


COPY . .

RUN npm run build

EXPOSE 4200

#npm i --save angular
#npx ng add @angular/material
#npm i @auth0/angular-jwt
#npm i ngx-socket-io