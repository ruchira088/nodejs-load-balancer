FROM node

WORKDIR /opt/load-balancer
COPY ./package.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run"]
CMD ["development"]