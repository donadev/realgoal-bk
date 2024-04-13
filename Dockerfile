FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable


# Set LD_LIBRARY_PATH environment variable
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu/"
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npx puppeteer browsers install chrome
# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
