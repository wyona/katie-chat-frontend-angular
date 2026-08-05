FROM nginx:1.17.1-alpine

COPY env/docker/build/nginx.conf /etc/nginx/nginx.conf
COPY dist/angular-gpt/ /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
