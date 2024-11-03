FROM node:lts-slim AS build

RUN mkdir -p /app
WORKDIR /app
COPY ./backend /app
RUN npm install

FROM node:lts-slim AS main
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4000
CMD ["npm","run","prod"]
