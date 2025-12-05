#!/bin/sh
set -e

# Valores por defecto
ENV_NAME="${ENVIRONMENT:-DEV}"
ENV_COLOR="${ENVIRONMENT:-dev}"

# Reemplazar placeholders en el HTML
sed -i "s/__ENV_NAME__/${ENV_NAME}/g" /usr/share/nginx/html/index.html
sed -i "s/__ENV_COLOR__/${ENV_COLOR}/g" /usr/share/nginx/html/index.html

echo "Environment badge configured: ${ENV_NAME}"

# Ejecutar nginx
exec nginx -g 'daemon off;'
