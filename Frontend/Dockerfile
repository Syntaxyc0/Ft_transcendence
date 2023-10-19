FROM node:latest

RUN apt update -y && apt upgrade -y

COPY Frontend /app/

RUN npm install -g @angular/cli

COPY config.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/config.sh

EXPOSE 4200

ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/config.sh"]
