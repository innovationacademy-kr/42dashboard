# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn global add @nestjs/cli
RUN yarn install
RUN yarn add rimraf
# RUN apt update && apt install -y vim gcc cmake rimraf
# Bundle app source
COPY . .
COPY "../../yarn.lock" .
# Creates a "dist" folder with the production build
# RUN yarn run build

# Start the server using the production build
# CMD ["sh", "-c", "yarn", "start"]
# CMD [ "yarn", "start" ]