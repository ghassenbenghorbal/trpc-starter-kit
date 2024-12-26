FROM node:current-buster-slim

# Install tini
RUN apt-get update && apt-get install -y tini

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run webpack

EXPOSE 5000

# Use tini as the entrypoint to handle SIGTERM correctly
# This is because the default entrypoint for docker is /bin/sh -c which doesn't propagate signals
ENTRYPOINT ["/usr/bin/tini", "--", "node", "./dist/bundle.js"]
