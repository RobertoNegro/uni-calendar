FROM node:12-slim

WORKDIR /www
ENV NODE_ENV development
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
CMD ["yarn", "run", "start"]
EXPOSE 80
