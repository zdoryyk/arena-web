FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/arena-web/* /usr/share/nginx/html/


EXPOSE 4500

CMD ["nginx", "-g", "daemon off;"]
