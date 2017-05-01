FROM nodesource/node:4.0

RUN npm install formidable
ADD . .

#CMD ["node","index.js"]