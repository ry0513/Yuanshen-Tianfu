FROM node:16.17.0-alpine
WORKDIR /app
COPY ./static ./static
COPY ./app.js ./app.js
COPY ./character.js ./character.js
COPY ./init.js ./init.js
COPY ./package.json ./package.json
RUN  npm i
EXPOSE 3098
CMD [ "npm", "run", "app" ]