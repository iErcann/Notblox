# Use the official Node.js 20-alpine image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY back /app/back
COPY front /app/front
COPY shared /app/shared

WORKDIR /app/back

RUN rm -rf package-lock.json node_modules

RUN npm install

RUN ls -a

# Build the application
RUN npm run build

# Expose the port that the application runs on
EXPOSE 8001

# Command to run the application
CMD ["node", "./dist/back/src/index.js"]
