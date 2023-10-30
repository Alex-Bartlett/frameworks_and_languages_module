# FROM python:alpine
# WORKDIR /app/
# COPY . .
# CMD ["python", "-m", "http.server", "8000"]

FROM node
WORKDIR /app/
RUN npm install express
COPY . .
ENTRYPOINT ["node", "app.js"]