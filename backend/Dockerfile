FROM node:16.13.2-alpine
ENV NODE_ENV=production
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./package-lock.json ./

RUN apk add --no-cache git
RUN git config --global url."https://".insteadOf git://
RUN npm install --production

COPY . .

CMD npm i && npm run dev
