#!/bin/bash

echo "=== Estado Blue-Green Deployment ==="
echo ""

echo "Contenedores:"
docker ps --filter "name=app-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "Nginx - Upstream activo:"
grep -A1 "upstream app_upstream" /etc/nginx/sites-available/app.conf | grep "server"
echo ""

echo "Health checks:"
echo -n "Blue (3001): "
curl -s http://127.0.0.1:3001/health || echo "No responde"

echo -n "Green (3002): "
curl -s http://127.0.0.1:3002/health || echo "No responde"
echo ""

echo "Servicio principal (Nginx):"
curl -s http://127.0.0.1/health > /dev/null && echo "Activo" || echo "Inactivo"
