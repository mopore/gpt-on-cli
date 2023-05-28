FROM node:19-slim
WORKDIR /app

RUN npm install -g pnpm
COPY package*.json /app/
RUN pnpm install

COPY .env /app
COPY src /app/src/
COPY tsconfig.json /app/
RUN pnpm build

ENV FORCE_COLOR=1
ENV TZ=UTC
ENTRYPOINT ["node", "dist/App.js"]