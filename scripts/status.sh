#!/bin/bash

echo "=== Estado Blue-Green Deployment ==="
echo ""

echo "Contenedores:"
docker ps --filter "name=app-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "Nginx - Upstream activo:"
grep "server 127.0.0.1" /etc/nginx/sites-available/app.conf | grep -v "^#" | head -1
echo ""

echo "Health checks:"
echo -n "Blue (3000): "
curl -s http://127.0.0.1:3000/health || echo "No responde"

echo -n "Green (3001): "
curl -s http://127.0.0.1:3001/health || echo "No responde"
echo ""

echo "Servicio principal:"
curl -s http://127.0.0.1/health > /dev/null && echo "Activo" || echo "Inactivo"
