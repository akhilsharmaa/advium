FROM node:alpine

WORKDIR /usr/app
COPY ./ ./

RUN npm i 

EXPOSE 3000
CMD ["node", "server.js"]