# Use the official Nginx image as the base image
FROM nginx

# Copy your Sphinx HTML files to the Nginx web server's document root
COPY . /usr/share/nginx/html

# Expose port 80 (the default HTTP port)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
