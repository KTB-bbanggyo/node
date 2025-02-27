# node-app/Dockerfile
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y default-mysql-client

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node" , "server.js"]
