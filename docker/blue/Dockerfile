FROM nginx:alpine

# Copiar tu proyecto estático
COPY index.html /usr/share/nginx/html/index.html
COPY estilos.css /usr/share/nginx/html/estilos.css

# Si tienes imágenes o carpetas, agrégalas así:
# COPY img/ /usr/share/nginx/html/img/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
