ARG NODE_VERSION=20.5.1

FROM node:${NODE_VERSION}-alpine as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY src src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY nuxt.config.ts .

RUN npm install --production=false

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
