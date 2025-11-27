#!/bin/bash
set -e

ENVIRONMENT=$1

if [ "$ENVIRONMENT" == "blue" ]; then
    PORT=3001
    CONTAINER_NAME="app-blue"
elif [ "$ENVIRONMENT" == "green" ]; then
    PORT=3002
    CONTAINER_NAME="app-green"
else
    echo "Uso: ./deploy.sh [blue|green]"
    exit 1
fi

echo "Desplegando en $ENVIRONMENT (puerto $PORT)..."

docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

docker build -t mi-app:latest .

docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    --restart unless-stopped \
    mi-app:latest

echo "Despliegue en $ENVIRONMENT completado"
docker ps | grep $CONTAINER_NAME
