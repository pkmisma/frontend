# Stage 1: build the static site (self-contained, no dependency on earlier pipeline stages)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

# Stage 2: serve with nginx
FROM nginxinc/nginx-unprivileged:1.27-alpine
# Official image renders *.template files with envsubst into /etc/nginx/conf.d at startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_URL=http://cosmic-backend:80
EXPOSE 8080
