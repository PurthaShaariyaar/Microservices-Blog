# Specify a base image
FROM node:14-alpine

ENV CI=true
ENV WDS_SOCKET_PORT=0

# Set a working directory
WORKDIR /app

# Install configurations and dependencies
COPY package.json ./
RUN npm install
COPY ./ ./

# Specify a command to run when the container starts up
CMD ["npm", "start"]
