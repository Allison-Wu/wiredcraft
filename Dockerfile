FROM node:14.15.4-alpine

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY ./.npmr* .

RUN yarn install --production

COPY ./dist ./dist

EXPOSE 3000
EXPOSE 22
ENV PORT 3000
ENV NODE_ENV production

CMD ["yarn", "start:prod"]
