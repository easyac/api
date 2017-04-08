.PHONY: build run

setup:
	yarn

run-mongo:
	docker run -p 27017:27017 -d mongo

run:
	MONGO_URL=mongodb://localhost:27017/easyac npm start

build:
	docker build -t easyac/api:latest .

push:
	docker push easyac/api:latest
