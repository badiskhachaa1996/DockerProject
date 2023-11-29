FROM node:16-alpine AS build
WORKDIR /opt/app/ims/front

COPY . .
RUN npm install
RUN npm run build
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /opt/app/ims/front /usr/share/nginx/html
EXPOSE 4200