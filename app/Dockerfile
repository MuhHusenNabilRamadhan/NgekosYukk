FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Menggunakan npm ci lebih stabil untuk production/deploy
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]