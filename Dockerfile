# Use Node.js base image
FROM node:18

# Install ODBC dev tools and native build tools
RUN apt-get update && apt-get install -y \
    unixodbc-dev \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
