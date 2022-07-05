# Base image
FROM node:18

# Create app directory
WORKDIR /packages/server

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn global add @nestjs/cli
COPY . /
RUN yarn
RUN yarn add rimraf
# RUN apt update && apt install -y vim gcc cmake rimraf
# Bundle app source
# Creates a "dist" folder with the production build
# RUN yarn run build
EXPOSE 3000
# Start the server using the production build
# CMD ["sh", "-c", "yarn", "start", "&&", "yarn", "start"]
CMD [ "yarn", "start" ]