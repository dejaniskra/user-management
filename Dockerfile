FROM node:16

WORKDIR /usr

COPY .env ./

COPY package.json ./

COPY tsconfig.json ./

RUN npm install

COPY src ./src

EXPOSE 7000

CMD ["npm","run","start"]