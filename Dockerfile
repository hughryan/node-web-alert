FROM node:carbon

ENV NODE_ENV=production

WORKDIR /usr/src/webalert

VOLUME /usr/src/webalert/screenshots

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production=true

COPY . .

CMD [ "yarn", "prod" ]
