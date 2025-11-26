#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/sites-available/app.conf"

echo "Revirtiendo a Blue..."

sudo cp $NGINX_CONF $NGINX_CONF.bak

sudo sed -i "s/server 127.0.0.1:[0-9]*/server 127.0.0.1:3000/" $NGINX_CONF

if ! sudo nginx -t; then
    echo "Error en Nginx"
    exit 1
fi

sudo nginx -s reload

echo "Revertido a Blue"
grep "server 127.0.0.1" $NGINX_CONF | head -1
