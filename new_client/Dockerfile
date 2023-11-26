FROM node:19 as build
ENV NODE_ENV=production
WORKDIR /app/
COPY package*.json .
RUN npm install
COPY . ./
RUN npm run build

FROM node:19-alpine3.16
WORKDIR /app/
COPY --from=build /app .

# Svelte uses vite which serves on 4173 in preview mode
# https://stackoverflow.com/questions/61106423/how-to-put-a-svelte-app-in-a-docker-container

ENV HOST=0.0.0.0
EXPOSE 4173
CMD ["npm","run","preview","--","--host","0.0.0.0"]
