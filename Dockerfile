FROM node:16.17.1 As development

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION

FROM node:16.17.1 As build

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/api/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node


FROM node:16.17.1 As production

COPY --chown=node:node --from=build /usr/src/api/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/api/dist ./dist

RUN npm run build

CMD [ "node", "dist/main.js" ]
