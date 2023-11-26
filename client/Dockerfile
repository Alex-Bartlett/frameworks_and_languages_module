FROM node:19 as build
# Vite doesn't install when node env is production
# https://github.com/vitejs/vite/issues/14045
# ENV NODE_ENV=production
WORKDIR /app/
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . ./
RUN npm run build

FROM node:19-alpine3.16
WORKDIR /app/
COPY --from=build /app .

ENV HOST=0.0.0.0
EXPOSE 8001
CMD ["npm","run","preview","--","--host","0.0.0.0"]
