FROM node:latest

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

RUN ng watch