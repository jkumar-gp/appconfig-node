FROM --platform=linux/arm64/v8 node:15.4

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]