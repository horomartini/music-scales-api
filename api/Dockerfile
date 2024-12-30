FROM node:20-alpine

WORKDIR /usr/api

COPY package.json ./

# RUN npm install --omit=optional # TODO: makes TS errors due to issues with missing imports and checking graphql/ files anyway (resolution: mockups?)
RUN npm install

COPY . .
