CONTAINER_NAME=recipeBook
# production
export CONTAINER_NAME=$CONTAINER_NAME
export PORT=8020
docker-compose -p $CONTAINER_NAME up -d --build