# Development
FROM node:18-slim AS development
ENV NODE_ENV development
ARG PORT=3000
ENV PORT ${PORT}
EXPOSE 3000 9229

# Set global npm dependencies to be stored under the node user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV MONGO_URL=mongodb://mongo:27017/dream-league

# Install Chromium and dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    git \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

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
