FROM node:12
RUN npm install -g http-server
WORKDIR /app
COPY /dist/ .
ENV PORT=8080
EXPOSE 8080
CMD http-server -a 0.0.0.0 -p 8080