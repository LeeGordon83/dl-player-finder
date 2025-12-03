# Development
FROM node:18-alpine AS development
ENV NODE_ENV development
ARG PORT=3000
ENV PORT ${PORT}
EXPOSE 3000 9229

# Set global npm dependencies to be stored under the node user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV MONGO_URL=mongodb://mongo:27017/dream-league

# Install Chromium and dependencies for Puppeteer
RUN apk update && \
    apk add --no-cache \
    git \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Tell Puppeteer to skip downloading Chrome and use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./app ./app
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV production
RUN npm ci --only=production
CMD [ "node", "app" ]
