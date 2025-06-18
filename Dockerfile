# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]

