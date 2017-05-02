FROM nodesource/node:4.0

ADD . .
RUN npm install

CMD ["node","app.js"]