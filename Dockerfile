FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY .next ./.next
COPY public ./public
COPY .env.local ./

EXPOSE 3000

CMD ["node", "server.js"]
