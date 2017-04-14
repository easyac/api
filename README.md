[![CodeFactor](https://www.codefactor.io/repository/github/easyac/api/badge)](https://www.codefactor.io/repository/github/easyac/api)

Docker run

```shell
docker run -p 3000:3000 --link mongo:mongo --env MONGO_URL=mongodb://mongo/easyac easyac/api
```

Start withou docker
```shell
DEBUG=* NODE_ENV=dev PORT=3000 MONGO_URL=mongodb://localhost/easyac JWT_SECRET="[YteUqD8?HAG{PCkLjYwms3ura[@aJy,@9)wt=x" nodemon ./bin/www

```
