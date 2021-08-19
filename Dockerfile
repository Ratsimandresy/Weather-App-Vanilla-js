FROM node:12

WORKDIR /app

COPY package.json /app

RUN npm update && npm install -g browser-sync

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]