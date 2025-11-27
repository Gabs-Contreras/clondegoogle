#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/sites-available/app.conf"

if [ "$1" = "blue" ]; then
    TARGET_PORT=3001
else
    TARGET_PORT=3002
fi

echo " Cambiando tráfico a puerto $TARGET_PORT..."

sudo sed -i "/upstream app_upstream {/,/}/s/server 127.0.0.1:[0-9]*/server 127.0.0.1:$TARGET_PORT/" $NGINX_CONF

sudo nginx -t || { echo " Error: Configuración inválida"; exit 1; }

sudo systemctl reload nginx

echo "✔️ Tráfico cambiado a $TARGET_PORT"
