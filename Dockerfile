FROM node:12.16.3
ARG APP_DIR="/usr/src/consumer"
WORKDIR $APP_DIR
COPY ./package*.json ./
RUN  npm ci
ENV  PATH="$PATH:$APP_DIR/node_modules/.bin"
COPY ./ ./
