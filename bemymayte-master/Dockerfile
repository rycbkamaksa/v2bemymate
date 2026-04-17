FROM node:18.4

WORKDIR /app/bemymate

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY ./ ./

RUN yarn build
CMD node .output/server/index.mjs
