FROM node:7

ENV NODE_ENV production
ENV PORT 3000
ENV DEBUG api
ENV TZ America/Sao_Paulo

ADD . /app
WORKDIR /app

RUN npm install

EXPOSE 3000

CMD node bin/www
