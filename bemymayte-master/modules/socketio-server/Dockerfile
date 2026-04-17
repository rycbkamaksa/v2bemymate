FROM node:18.4

WORKDIR /app/bemymate-search

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY ./ ./

CMD yarn serve
