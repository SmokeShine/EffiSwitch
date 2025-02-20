# Use an official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install additional dependencies (axios and chart.js)
RUN pnpm add axios chart.js prop-types

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Print the react-dom version during the container startup
RUN pnpm list react-dom

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]