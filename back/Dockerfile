FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app/ems/back
WORKDIR /opt/app/ems/back
COPY src/package.json src/package-lock.json ./
RUN npm install pm2 -g
COPY . .
EXPOSE 3000
CMD ["pm2-runtime", "index.js"]
#CMD [ "npm", "start"]