DOCKER_IMAGE:=client

build:
	docker build --tag ${DOCKER_IMAGE} .

run:
	docker run --rm -it --publish 4173:4173 ${DOCKER_IMAGE}