FROM node:20-alpine

WORKDIR /app

COPY src src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY nuxt.config.ts .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
