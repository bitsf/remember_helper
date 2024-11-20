FROM docker.1ms.run/node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY . .

RUN npm run build

FROM docker.1ms.run/caddy:alpine
COPY --from=build /app/dist /usr/share/caddy
EXPOSE 80