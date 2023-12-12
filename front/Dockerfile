FROM node:16-alpine AS build
WORKDIR /opt/app/ems/front

COPY . .
RUN npm install
RUN npm run build --configuration=prod # FIXME env.
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /opt/app/ems/front /var/www/html/ems/front
EXPOSE 4200