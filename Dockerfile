# Usar Nginx como servidor web
FROM nginx:alpine

# Copiar todo tu proyecto al directorio público de Nginx
COPY . /usr/share/nginx/html

# Copiar archivo health
COPY public/health /usr/share/nginx/html/health

# Exponer puerto 80 (interno del contenedor)
EXPOSE 80

# Nginx arranca automáticamente al iniciar el contenedor
