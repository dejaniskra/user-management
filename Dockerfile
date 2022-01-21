FROM node:16

WORKDIR /usr

COPY .env ./

COPY package.json ./

COPY tsconfig.json ./

COPY src ./src

RUN npm install

EXPOSE 700

CMD ["npm","run","start"]