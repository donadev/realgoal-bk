FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y nodejs npm libnss3 libdbus-1-3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set LD_LIBRARY_PATH environment variable
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu/"
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
