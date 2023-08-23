FROM node:20.2-alpine

WORKDIR /app
RUN npm i -g pnpm@8.6

COPY . .
WORKDIR /app/webviewer

RUN pnpm install
RUN pnpm build

WORKDIR build
EXPOSE 80
ENV HOST=0.0.0.0 PORT=80 NODE_ENV=production

CMD ["node", "index.js"]

