FROM node:16

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV NODE_ENV=prod

RUN npm run build

CMD [ "node", "dist/main.js" ]