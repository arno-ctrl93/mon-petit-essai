FROM node:16

WORKDIR /usr/src/app
COPY package*.json  ./ 

COPY . .

ENV DATABASE_URL="postgresql://chabal@db-prod-mon-petit-essai:esposito28!@db-prod-mon-petit-essai.postgres.database.azure.com:5432/postgres?schema=public"

RUN ls

RUN npm ci

CMD ["npm", "run", "prod"]
