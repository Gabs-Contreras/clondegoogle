# No necesitamos Node porque no hay build
FROM nginx:alpine

# Copia la configuración de Nginx para la versión GREEN
COPY docker/green/default.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos
COPY index.html /usr/share/nginx/html/index.html
COPY estilos.css /usr/share/nginx/html/estilos.css

# Si después agregas imágenes o carpetas, puedes copiarlas así:
# COPY img/ /usr/share/nginx/html/img/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
