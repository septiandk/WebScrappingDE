FROM node:slim

RUN apt install nginx

COPY config/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install 

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Express app is listening on (default is 3000)
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["sh", "-c", "systemctl start nginx","node", "index.js"]