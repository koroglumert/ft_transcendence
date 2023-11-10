FROM node
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./package-lock.json ./
COPY . .
RUN npm install

CMD  npm i && npm start
