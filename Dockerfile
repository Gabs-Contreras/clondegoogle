# Usar Nginx como servidor web
FROM nginx:alpine

# Copiar archivos estáticos del proyecto
COPY src/ /usr/share/nginx/html/

# Copiar archivo health
COPY public/health /usr/share/nginx/html/health

# Exponer puerto 80
EXPOSE 80

# Nginx arranca automáticamente
