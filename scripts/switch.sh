#!/bin/bash
ENVIRONMENT=$1

if [ "$ENVIRONMENT" == "blue" ]; then
    NEW_PORT=3001
elif [ "$ENVIRONMENT" == "green" ]; then
    NEW_PORT=3002
else
    echo "ENV inválido"
    exit 1
fi

sed -i "s/server 127.0.0.1:300[12]/server 127.0.0.1:$NEW_PORT/" /etc/nginx/sites-available/app.conf

nginx -t && systemctl reload nginx

echo "Ahora Nginx apunta a $ENVIRONMENT ($NEW_PORT)"
