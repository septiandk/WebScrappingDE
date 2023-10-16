FROM node:slim

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install 

# Install apm
npm install elastic-apm-node --save

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Express app is listening on (default is 3000)
EXPOSE 80

# Define the command to start your Node.js application
CMD ["node", "index.js"]
