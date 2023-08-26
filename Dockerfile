FROM node:16

WORKDIR /usr/src/app
COPY package*.json  ./ 

COPY . .

ENV DATABASE_URL="postgresql://db-prod-mon-petit-essai.postgres.database.azure.com:5432/postgres?user=chabal@db-prod-mon-petit-essai&password=esposito28!&sslmode=require"

RUN ls

RUN npm ci

CMD ["npm", "run", "prod"]
