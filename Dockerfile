FROM node:18

WORKDIR ./todo

COPY package.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]