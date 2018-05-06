CONTAINER_NAME=recipeBook
# production
export CONTAINER_NAME=$CONTAINER_NAME
export PORT=8020
docker-compose -p expressLibrary up -d --build