# Frontend build
FROM node:20 AS build
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Backend setup
FROM node:20
WORKDIR /app
COPY --from=build /app/client/build ./client/build
COPY server.js ./server.js
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --only=production

EXPOSE 3001
CMD ["node", "server.js"]