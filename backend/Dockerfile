FROM node:16

WORKDIR /usr/src/app
COPY package*.json .env ./ 

COPY . .

RUN npm ci

CMD ["npm", "start"]