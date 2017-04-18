.PHONY: build run

setup:
	yarn

docker-stop:
	-@docker stop redis mongo easyac-api
	-@docker rm redis mongo easyac-api

docker-start-redis:
	-@docker stop redis
	-@docker rm redis
	docker run --name redis -p 6379:6379 -d redis redis-server --appendonly yes

docker-start-mongo:
	-@docker stop mongo
	-@docker rm mongo
	docker run --name mongo -p 27017:27017 -d mongo

docker-run: docker-start-mongo docker-start-redis
	-@docker stop easyac-api
	-@docker rm easyac-api
	docker run \
		--name easyac-api \
		-p 3000:3000 \
		--link redis:redis \
		--link mongo:mongo \
		--env NODE_ENV=development \
		--env DEBUG=api \
		--env MONGO_URL=mongodb://mongo/easyac \
		--env REDIS_HOST=redis \
		--env REDIS_PORT=6379 \
		easyac/api:latest

run: docker-start-mongo docker-start-redis
	MONGO_URL=mongodb://localhost:27017/easyac npm start

docker-build:
	docker build -t easyac/api:latest .

docker-push:
	docker push easyac/api:latest
