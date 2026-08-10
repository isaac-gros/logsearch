FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

# On lance Vite en mode développement en exposant le port au réseau du conteneur
CMD ["npm", "run", "dev", "--", "--host"]