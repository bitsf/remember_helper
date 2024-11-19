FROM docker.1ms.run/node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY . .

RUN npm run build

FROM docker.1ms.run/nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/src/sounds /usr/share/nginx/html/sounds
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 