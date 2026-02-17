FROM node:22-alpine

WORKDIR /app

COPY .next/standalone ./
COPY .next/static .next/static
COPY public ./public
COPY .env.local ./

EXPOSE 3000

CMD ["node", "server.js"]
