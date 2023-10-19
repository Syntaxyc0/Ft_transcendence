FROM node:latest

COPY package*.json ./
COPY prisma ./prisma/

COPY . .


EXPOSE 3333



ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]