FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server/package.json server/
RUN cd server && npm install

COPY client/package.json client/
RUN cd client && npm install

COPY . .

RUN cd client && npm run build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/index.js"]
