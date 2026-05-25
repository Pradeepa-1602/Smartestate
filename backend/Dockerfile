FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=docker

EXPOSE 5000

CMD ["node", "server.js"]