# Expects the "Build app" stage to have produced ./dist (npm install && npm run build)
FROM nginxinc/nginx-unprivileged:1.27-alpine
# Official image renders *.template files with envsubst into /etc/nginx/conf.d at startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY dist /usr/share/nginx/html
ENV BACKEND_URL=http://cosmic-backend:80
EXPOSE 8080
