FROM node
WORKDIR /app/
RUN npm install fastify && npm install @fastify/cors && npm install @fastify/static
COPY . .
ENTRYPOINT ["node", "server.js"]