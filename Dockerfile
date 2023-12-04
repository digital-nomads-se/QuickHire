# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install application dependencies
RUN npm install

# Step 5: Bundle app source inside the Docker image
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Step 8: Define the command to run the app
CMD [ "npm", "start" ]