FROM node:16-alpine AS build
WORKDIR /opt/app/ims/forms-app

COPY . .
RUN npm install
RUN npm run build --configuration=prod # FIXME env.
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /opt/app/ims/forms-app /var/www/html/ims/forms-app
EXPOSE 4210