FROM node:16

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# expose the port where the app is located
EXPOSE 8080

# run the dev server.
CMD [ "npm", "run", "serve"]
