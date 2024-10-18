FROM node:20

WORKDIR /usr/src/api

COPY package.json ./

RUN npm install

COPY . .

CMD npm run dev
