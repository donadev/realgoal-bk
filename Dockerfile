FROM node:20

# Set environment variables
# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y libnss3 && \
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
