FROM mhart/alpine-node:9

ENV NODE_PORT 3001

WORKDIR /app

COPY .secrets package.json index.js /app/

RUN npm install

EXPOSE ${NODE_PORT}

CMD ["node", "/app/index.js"]