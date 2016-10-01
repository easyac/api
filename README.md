
Docker run

```
docker run -p 3000:3000 --link mongo:mongo --env MONGO_URL=mongodb://mongo/easyac easyac/api
```
