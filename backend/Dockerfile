FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./ 

COPY . .

RUN ls

RUN npm ci

CMD ["npm", "start"]
