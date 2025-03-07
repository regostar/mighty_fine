# Use an official lightweight Node.js image.
FROM node:16-alpine

# Create and set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port that the application listens on (default 3000)
EXPOSE 3000

# Start the application using the npm start script
CMD [ "npm", "start" ]
