FROM node
WORKDIR /app/
RUN npm install fastify && npm install @fastify/cors
COPY . .
ENTRYPOINT ["node", "server.js"]