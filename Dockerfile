FROM node:8
ADD . /code
WORKDIR /code
RUN npm install
CMD ["npm", "run", "start"]
