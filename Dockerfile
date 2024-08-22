
FROM node:20-alpine

WORKDIR /app

COPY app/package.json app/package-lock.json ./

RUN npm install

COPY app/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
