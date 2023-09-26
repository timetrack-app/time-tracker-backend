# FROM node:14.18.2
FROM node:16.13.1-alpine3.14

WORKDIR /app

COPY package.json ./
COPY env/.env.dev ./.env

RUN rm -rf node_modules
RUN npm cache clean -force
RUN npm install --verbose
RUN npm install --no-package-lock

COPY . .

EXPOSE 3000
CMD npm run start:watch