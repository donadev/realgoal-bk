FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update && \
    apt-get install -y libnss3 libdbus-1-3 libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set LD_LIBRARY_PATH environment variable
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu/"
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g npx
RUN npx puppeteer browsers install chrome
# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
