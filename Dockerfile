FROM node:12
WORKDIR /app
COPY *.json ./
COPY webpack.config.js ./
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD [ "npm","start" ]