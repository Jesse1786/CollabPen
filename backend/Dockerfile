FROM node:18-slim AS build

RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY .env /app
COPY . /app

FROM node:18-slim AS main
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4000
CMD ["npm", "run", "prod"]
