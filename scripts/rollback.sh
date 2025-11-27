#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/sites-available/app.conf"

echo "=== Rollback: regresando a Blue (3001) ==="

sudo cp $NGINX_CONF $NGINX_CONF.bak

# Cambiar el upstream a Blue (3001)
sudo sed -i "s/server 127.0.0.1:300[12]/server 127.0.0.1:3001/" $NGINX_CONF

if ! sudo nginx -t; then
    echo "Error en configuración de Nginx"
    exit 1
fi

sudo systemctl reload nginx

echo "Rollback completado. Upstream actual:"
grep "server 127.0.0.1" $NGINX_CONF | grep -v "^#" | head -1
