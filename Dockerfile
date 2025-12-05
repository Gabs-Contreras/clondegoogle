# Usar Nginx como servidor web
FROM nginx:alpine

# Copiar archivos estáticos del proyecto
COPY src/ /usr/share/nginx/html/

# Copiar archivo health
COPY public/health /usr/share/nginx/html/health

# Copiar script de entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer puerto 80
EXPOSE 80

# Usar entrypoint personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]
