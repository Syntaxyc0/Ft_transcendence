FROM node:latest

RUN apt update -y && apt upgrade -y

RUN npm install -g npm-check-updates

COPY Backend/entrypoint.sh .

EXPOSE 3333

ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]