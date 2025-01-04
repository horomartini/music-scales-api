FROM node:20-alpine

WORKDIR /usr/apollo

COPY package.json ./

RUN npm install

COPY . .

RUN npm run codegen
