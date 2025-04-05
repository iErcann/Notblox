FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript
RUN npm run build

# Run the app
CMD [ "node", "dist/monitor.js" ]
