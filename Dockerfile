FROM node:16.13.1

RUN mkdir /app
WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

ENV NODE_ENV=prod

RUN npm run build

CMD [ "node", "dist/main.js" ]