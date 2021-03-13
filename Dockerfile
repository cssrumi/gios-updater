FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY ./src/. ./

CMD ["node", "main.js"]
