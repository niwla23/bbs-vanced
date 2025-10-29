FROM node:24.0-alpine

WORKDIR /app
RUN npm i -g pnpm@10.20

COPY . .
WORKDIR /app/webviewer

ENV CI=true
RUN pnpm install
RUN pnpm build

WORKDIR build
EXPOSE 80
ENV HOST=0.0.0.0 PORT=80 NODE_ENV=production

CMD ["node", "index.js"]

